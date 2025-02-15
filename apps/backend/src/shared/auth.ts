import middy from "@middy/core";
import { APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from "aws-lambda";

export function getSessionIdFromEvent(event: APIGatewayProxyEventV2): string | undefined {
  const cookies = event.cookies;
  const cookieHeader = cookies?.find((cookie) => cookie.startsWith("sessionId="));
  return cookieHeader?.split("=")[1] ?? undefined;
}

export const authMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEventV2, APIGatewayProxyResultV2> = async (
    request,
  ) => {
    const sessionId = getSessionIdFromEvent(request.event);

    if (!sessionId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
      };
    }
  };

  return {
    before,
  };
};

export const sessionMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> => {
  const before: middy.MiddlewareFn<APIGatewayProxyEventV2, APIGatewayProxyResultV2> = async (
    request,
  ) => {
    const sessionId = getSessionIdFromEvent(request.event);
    const body = JSON.parse(request.event.body || "{}");

    request.event.body = {
      ...body,
      sessionId,
    };
  };

  return {
    before,
  };
};
