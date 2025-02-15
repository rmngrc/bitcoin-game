import { parser } from "@aws-lambda-powertools/parser/middleware";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { sessionMiddleware } from "../../shared/auth";
import { getSessionData, startSession } from "../../shared/repository";

const TABLE_NAME = process.env.DYNAMODB_TABLE || "";

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const EventSchema = z.object({
  body: z.object({
    sessionId: z.string().optional(),
  }),
});

type EventType = z.infer<typeof EventSchema>;

const lambdaHandler = async (event: EventType): Promise<APIGatewayProxyResult> => {
  const sessionId = event.body.sessionId;

  if (!sessionId) {
    const sessionData = await startSession({
      ddbDocClient,
      tableName: TABLE_NAME,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        score: sessionData.score,
      }),
      headers: {
        "Set-Cookie": `sessionId=${sessionData.sessionId}; HttpOnly; Path=/; Max-Age={60*60*24*365*10}; Secure; SameSite=None`,
      },
    };
  }

  const sessionData = await getSessionData({
    ddbDocClient,
    tableName: TABLE_NAME,
    sessionId,
  });

  if (!sessionData) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Session not found" }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ score: sessionData.score }),
    };
  }
};

export const handler = middy(lambdaHandler)
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(sessionMiddleware())
  .use(
    parser({
      schema: EventSchema,
    }),
  );
