import { Guess, LastGuess } from "@/types";
import { render, screen } from "@testing-library/react";
import { LastBetDisplay } from "./LastBetDisplay";

describe("LastBetDisplay", () => {
  it("renders nothing when lastGuess is null", () => {
    render(<LastBetDisplay lastGuess={null} />);

    expect(screen.queryByText(/Your last guess was/)).toBeNull();
  });

  it("renders last guess and initial price only", () => {
    const lastGuess: LastGuess = {
      guess: Guess.Up,
      initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
    };

    render(<LastBetDisplay lastGuess={lastGuess} />);

    expect(screen.getByText("⬆ Up")).toBeInTheDocument();
    expect(screen.getByText("US$45,000.00")).toBeInTheDocument();
    expect(screen.queryByTestId("final-price")).not.toBeInTheDocument();
  });

  describe("when guess is resolved", () => {
    it("renders last guess and initial and final price if available", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastBetDisplay lastGuess={lastGuess} />);

      expect(screen.getByText("⬆ Up")).toBeInTheDocument();
      expect(screen.getByText("US$45,000.00")).toBeInTheDocument();
      expect(screen.getByText("US$47,000.00")).toBeInTheDocument();
      expect(screen.getByTestId("result-correct")).toBeInTheDocument();
    });

    it("renders variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastBetDisplay lastGuess={lastGuess} />);

      expect(screen.getByTestId("result-correct")).toBeInTheDocument();
      expect(screen.queryByTestId("result-equal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-wrong")).not.toBeInTheDocument();
    });

    it("renders negative variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4300000, currency: "USD", symbol: "$" },
        variance: -1,
      };

      render(<LastBetDisplay lastGuess={lastGuess} />);

      expect(screen.queryByTestId("result-correct")).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-equal")).not.toBeInTheDocument();
      expect(screen.getByTestId("result-wrong")).toBeInTheDocument();
    });

    it("renders zero variance correctly", () => {
      const lastGuess: LastGuess = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        variance: 0,
      };

      render(<LastBetDisplay lastGuess={lastGuess} />);

      expect(screen.queryByTestId("result-correct")).not.toBeInTheDocument();
      expect(screen.getByTestId("result-equal")).toBeInTheDocument();
      expect(screen.queryByTestId("result-wrong")).not.toBeInTheDocument();
    });
  });
});
