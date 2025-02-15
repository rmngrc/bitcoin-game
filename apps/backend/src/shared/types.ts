export enum Guess {
  Up = "up",
  Down = "down",
}

export interface ParsedAPIGatewayProxyEvent {
  body: Record<string, any>;
}
