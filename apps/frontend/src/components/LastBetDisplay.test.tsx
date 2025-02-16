import { Guess, LastBet } from "@/types";
import { render, screen } from "@testing-library/react";
import { LastBetDisplay } from "./LastBetDisplay";

describe("LastBetDisplay", () => {
  it("renders nothing when lastBet is null", () => {
    render(<LastBetDisplay lastBet={null} />);

    expect(screen.queryByText(/Your last guess was/)).toBeNull();
  });

  it("renders last guess and initial price only", () => {
    const lastBet: LastBet = {
      guess: Guess.Up,
      initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
    };

    render(<LastBetDisplay lastBet={lastBet} />);

    expect(screen.getByText("⬆ Up")).toBeInTheDocument();
    expect(screen.getByText("US$45,000.00")).toBeInTheDocument();
    expect(screen.queryByTestId("final-price")).not.toBeInTheDocument();
  });

  describe("when guess is resolved", () => {
    it("renders last guess and initial and final price if available", () => {
      const lastBet: LastBet = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastBetDisplay lastBet={lastBet} />);

      expect(screen.getByText("⬆ Up")).toBeInTheDocument();
      expect(screen.getByText("US$45,000.00")).toBeInTheDocument();
      expect(screen.getByText("US$47,000.00")).toBeInTheDocument();
      expect(screen.getByTestId("result-correct")).toBeInTheDocument();
    });

    it("renders variance correctly", () => {
      const lastBet: LastBet = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4700000, currency: "USD", symbol: "$" },
        variance: 1,
      };

      render(<LastBetDisplay lastBet={lastBet} />);

      expect(screen.getByTestId("result-correct")).toBeInTheDocument();
      expect(screen.queryByTestId("result-equal")).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-wrong")).not.toBeInTheDocument();
    });

    it("renders negative variance correctly", () => {
      const lastBet: LastBet = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4300000, currency: "USD", symbol: "$" },
        variance: -1,
      };

      render(<LastBetDisplay lastBet={lastBet} />);

      expect(screen.queryByTestId("result-correct")).not.toBeInTheDocument();
      expect(screen.queryByTestId("result-equal")).not.toBeInTheDocument();
      expect(screen.getByTestId("result-wrong")).toBeInTheDocument();
    });

    it("renders zero variance correctly", () => {
      const lastBet: LastBet = {
        guess: Guess.Up,
        initialPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        finalPrice: { amount: 4500000, currency: "USD", symbol: "$" },
        variance: 0,
      };

      render(<LastBetDisplay lastBet={lastBet} />);

      expect(screen.queryByTestId("result-correct")).not.toBeInTheDocument();
      expect(screen.getByTestId("result-equal")).toBeInTheDocument();
      expect(screen.queryByTestId("result-wrong")).not.toBeInTheDocument();
    });
  });
});
