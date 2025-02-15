import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "./index";

describe("handler", () => {
  it("should return status code 200", async () => {
    const event: APIGatewayProxyEvent = {} as any;
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
  });

  it("should return the correct body", async () => {
    const event: APIGatewayProxyEvent = {} as any;

    const result = await handler(event);

    expect(JSON.parse(result.body)).toEqual({ message: "Hello World" });
  });
});
