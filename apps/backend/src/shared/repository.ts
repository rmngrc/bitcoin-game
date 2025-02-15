import { ReturnValue } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

interface SessionData {
  sessionId: string;
  score: number;
}

const DEFAULT_SCORE = 0;

export const startSession = async ({
  ddbDocClient,
  tableName,
}: {
  ddbDocClient: DynamoDBDocumentClient;
  tableName: string;
}): Promise<SessionData> => {
  const sessionId = uuidv4();
  const score = DEFAULT_SCORE;

  await ddbDocClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        sessionId,
        score,
      },
    }),
  );

  return {
    sessionId,
    score,
  };
};

export const getSessionData = async ({
  ddbDocClient,
  tableName,
  sessionId,
}: {
  ddbDocClient: DynamoDBDocumentClient;
  sessionId: string;
  tableName: string;
}): Promise<SessionData | null> => {
  const queryResponse = await ddbDocClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "sessionId = :sessionId",
      ExpressionAttributeValues: {
        ":sessionId": sessionId,
      },
    }),
  );

  const item = queryResponse.Items?.[0];

  if (!item) {
    return null;
  }

  return {
    sessionId,
    score: item.score,
  };
};

export const updateSessionData = async ({
  ddbDocClient,
  tableName,
  sessionId,
  score,
}: {
  ddbDocClient: DynamoDBDocumentClient;
  tableName: string;
  sessionId: string;
  score: number;
}): Promise<SessionData | null> => {
  const response = await ddbDocClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: {
        sessionId,
      },
      UpdateExpression: "SET score = :score",
      ExpressionAttributeValues: {
        ":score": score,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    }),
  );

  return response.Attributes
    ? {
        sessionId: response.Attributes.sessionId,
        score: response.Attributes.score,
      }
    : null;
};
