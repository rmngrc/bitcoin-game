import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "./start";

describe("Start Session Handler", () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    ddbMock.reset();
  });

  it("creates a new session when no cookie exists", async () => {
    ddbMock.on(PutCommand).resolves({});

    const response = await handler({} as never, {} as AWSLambda.Context);

    // Verify DynamoDB call
    const putCalls = ddbMock.commandCalls(PutCommand);
    expect(putCalls).toHaveLength(1);

    const putParams = putCalls[0].args[0].input;
    expect(putParams).toMatchObject({
      TableName: "test-table",
      Item: {
        sessionId: expect.any(String),
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers).toHaveProperty("Set-Cookie");
    expect(response.headers?.["Set-Cookie"]).toMatch(/sessionId=[\w-]+/);
    expect(response.body).toEqual(JSON.stringify({ score: 0 }));
  });

  it("returns 404 when cookie provided but session does not exist", async () => {
    ddbMock.on(QueryCommand).resolves({});

    const response = await handler(
      {
        cookies: ["sessionId=non-existent-session-123"],
      } as never,
      {} as AWSLambda.Context,
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(JSON.stringify({ message: "Session not found" }));
  });

  it("returns 200 with score when valid session exists", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        {
          sessionId: "existing-session-123",
          score: 21,
        },
      ],
    });

    const response = await handler(
      {
        cookies: ["sessionId=existing-session-123"],
      } as never,
      {} as AWSLambda.Context,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers).toBeUndefined();
    expect(response.body).toEqual(JSON.stringify({ score: 21 }));
  });
});
