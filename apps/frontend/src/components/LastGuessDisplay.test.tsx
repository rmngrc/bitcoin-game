import { Guess, LastGuess } from "@/types";
import { render, screen } from "@testing-library/react";
import { LastGuessDisplay } from "./LastGuessDisplay";

describe("LastGuessDisplay", () => {
  it("renders nothing when lastGuess is null", () => {
    render(<LastGuessDisplay lastGuess={null} />);

    expect(screen.queryByText(/Your last guess was/)).toBeNull();
  });

  it("renders last guess and initial price only", () => {
    const lastGuess: LastGuess = {
      guess: Guess.Up,
      initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
    };

    render(<LastGuessDisplay lastGuess={lastGuess} />);

    expect(
      screen.getByText("Your last guess was up with BTC price of US$45,000.00"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Guess was resolved at price/)).toBeNull();
  });

  describe("when guess is resolved", () => {
    it("renders last guess and initial and final price if available", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastGuessDisplay lastGuess={lastGuess} />);

      expect(
        screen.getByText("Your last guess was up with BTC price of US$45,000.00"),
      ).toBeInTheDocument();
      expect(screen.getByText("Guess was resolved at price: US$47,000.00")).toBeInTheDocument();
    });

    it("renders variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastGuessDisplay lastGuess={lastGuess} />);

      expect(screen.getByText("Correct! +1 points!")).toBeInTheDocument();
    });

    it("renders negative variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4300000, currency: "USD", symbol: "$" },
        variance: -1,
      };

      render(<LastGuessDisplay lastGuess={lastGuess} />);

      expect(screen.getByText("Wrong! -1 points!")).toBeInTheDocument();
    });

    it("renders zero variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        variance: 0,
      };

      render(<LastGuessDisplay lastGuess={lastGuess} />);

      expect(screen.getByText("Equal! 0 points!")).toBeInTheDocument();
    });
  });
});
