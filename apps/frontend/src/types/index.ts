export type StartResponse = {
  score: number;
};

export type PriceResponse = {
  price: string;
};

export type Price = {
  amount: number;
  currency: string;
  symbol: string;
};

export enum Guess {
  Up = "up",
  Down = "down",
}

export type LastGuess = {
  initialPrice: Price;
  finalPrice?: Price;
  guess: Guess;
  variance?: number;
};
