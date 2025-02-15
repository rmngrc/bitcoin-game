import { parser } from "@aws-lambda-powertools/parser/middleware";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpErrorHandler from "@middy/http-error-handler";
import { APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { authMiddleware, sessionMiddleware } from "../../shared/auth";
import { getSessionData, updateSessionData } from "../../shared/repository";
import { Guess } from "../../shared/types";
import { validationErrorHandler } from "../../shared/validation";

const TABLE_NAME = process.env.DYNAMODB_TABLE || "";
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const EventSchema = z.object({
  body: z.object({
    previousPrice: z.number(),
    newPrice: z.number(),
    guess: z.union([z.literal(Guess.Up), z.literal(Guess.Down)]),
    sessionId: z.string(),
  }),
});

type EventType = z.infer<typeof EventSchema>;

const lambdaHandler = async (event: EventType): Promise<APIGatewayProxyResult> => {
  const sessionId = event.body.sessionId;

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
  }

  const { previousPrice, newPrice, guess } = event.body;
  const scoreVariance = calculateScoreVariance(previousPrice, newPrice, guess);
  const newScore = sessionData.score + scoreVariance;

  // Update the score in the database
  const updatedData = await updateSessionData({
    ddbDocClient,
    tableName: TABLE_NAME,
    sessionId,
    score: newScore,
  });

  if (!updatedData) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ score: updatedData.score, variance: scoreVariance }),
    };
  }
};

export const handler = middy(lambdaHandler)
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(authMiddleware())
  .use(sessionMiddleware())
  .use(validationErrorHandler())
  .use(parser({ schema: EventSchema }));

type ScoreVariance = 1 | 0 | -1;

function calculateScoreVariance(
  previousPrice: number,
  newPrice: number,
  guess: Guess,
): ScoreVariance {
  if (previousPrice < newPrice) {
    return guess === Guess.Up ? 1 : -1;
  } else if (previousPrice > newPrice) {
    return guess === Guess.Down ? 1 : -1;
  }

  return 0;
}
