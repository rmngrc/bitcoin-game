import { ReturnValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "./score";

describe("Score Session Handler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  const a_valid_request = {
    cookies: ["sessionId=existing-session-123"],
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ previousPrice: 100, newPrice: 200, guess: "up" }),
  } as unknown as APIGatewayProxyEvent;

  beforeEach(() => {
    ddbMock.reset();
  });

  it("returns 401 when no session cookie is provided", async () => {
    const response = await handler(
      {
        ...a_valid_request,
        cookies: [],
      } as never,
      {} as AWSLambda.Context,
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(JSON.stringify({ message: "Unauthorized" }));
  });

  it("returns 400 when invalid body is provided", async () => {
    const response = await handler(
      { ...a_valid_request, body: JSON.stringify({}) } as never,
      {} as AWSLambda.Context,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(JSON.stringify({ message: "Bad Request" }));
  });

  it("returns 404 when given session does not exist", async () => {
    ddbMock.on(QueryCommand).resolves({});

    const response = await handler({ ...a_valid_request } as never, {} as AWSLambda.Context);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(JSON.stringify({ message: "Session not found" }));
  });

  it("returns one point more", async () => {
    ddbMock
      .on(QueryCommand)
      .resolves({ Items: [{ sessionId: "existing-session-123", score: 20 }] });

    ddbMock
      .on(UpdateCommand)
      .resolves({ Attributes: { sessionId: "existing-session-123", score: 21 } });

    const response = await handler({ ...a_valid_request } as never, {} as AWSLambda.Context);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ score: 21, variance: 1 }));
  });

  it("returns one point less", async () => {
    ddbMock
      .on(QueryCommand)
      .resolves({ Items: [{ sessionId: "existing-session-123", score: 20 }] });

    ddbMock
      .on(UpdateCommand)
      .resolves({ Attributes: { sessionId: "existing-session-123", score: 19 } });

    const response = await handler(
      {
        ...a_valid_request,
        body: JSON.stringify({ previousPrice: 100, newPrice: 200, guess: "down" }),
      } as never,
      {} as AWSLambda.Context,
    );

    // Verify DynamoDB call
    const updateCalls = ddbMock.commandCalls(UpdateCommand);
    expect(updateCalls).toHaveLength(1);

    const updateParams = updateCalls[0].args[0].input;
    expect(updateParams).toMatchObject({
      TableName: "test-table",
      Key: {
        sessionId: "existing-session-123",
      },
      UpdateExpression: "SET score = :score",
      ExpressionAttributeValues: {
        ":score": 19,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ score: 19, variance: -1 }));
  });

  it("returns same score", async () => {
    ddbMock
      .on(QueryCommand)
      .resolves({ Items: [{ sessionId: "existing-session-123", score: 20 }] });

    ddbMock
      .on(UpdateCommand)
      .resolves({ Attributes: { sessionId: "existing-session-123", score: 20 } });

    const response = await handler(
      {
        ...a_valid_request,
        body: JSON.stringify({ previousPrice: 100, newPrice: 100, guess: "down" }),
      } as never,
      {} as AWSLambda.Context,
    );

    // Verify DynamoDB call
    const updateCalls = ddbMock.commandCalls(UpdateCommand);
    expect(updateCalls).toHaveLength(1);

    const updateParams = updateCalls[0].args[0].input;
    expect(updateParams).toMatchObject({
      TableName: "test-table",
      Key: {
        sessionId: "existing-session-123",
      },
      UpdateExpression: "SET score = :score",
      ExpressionAttributeValues: {
        ":score": 20,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({ score: 20, variance: 0 }));
  });
});
