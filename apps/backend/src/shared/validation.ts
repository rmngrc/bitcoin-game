import { ParseError } from "@aws-lambda-powertools/parser";
import middy from "@middy/core";

export const validationErrorHandler = (): middy.MiddlewareObj => ({
  onError: (request) => {
    if (request.error instanceof ParseError) {
      request.response = {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request" }),
      };
      return;
    }

    throw request.error; // Other errors go to httpErrorHandler()
  },
});
