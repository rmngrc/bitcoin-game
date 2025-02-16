import { useGameLogic } from "@/hooks/useGameLogic";
import { Guess } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock } from "vitest";
import { Game } from "./Game";

vi.mock("@/hooks/useGameLogic");

describe("Game", () => {
  const mockPrice = { amount: 5000000, currency: "USD", symbol: "$" };
  const mockHandleOnGuess = vi.fn();

  (useGameLogic as Mock).mockReturnValue({
    currentPrice: mockPrice,
    handleOnGuess: mockHandleOnGuess,
    isLoadingBTCPrice: false,
    gameState: {
      score: 0,
      lastGuess: null,
      canGuess: true,
    },
    countdown: 10,
  });

  it("renders child components with correct props", () => {
    render(<Game initialScore={0} />);

    expect(screen.getByText("US$50,000.00")).toBeInTheDocument();
    expect(screen.getByText("Your Score: 0")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /up/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /down/i })).toBeEnabled();
  });

  it("calls handleOnGuess when a guess is made", () => {
    render(<Game initialScore={0} />);

    fireEvent.click(screen.getByRole("button", { name: /up/i }));

    expect(mockHandleOnGuess).toHaveBeenCalledWith(Guess.Up);
  });

  it("disables guess buttons when canGuess is false", () => {
    (useGameLogic as Mock).mockReturnValue({
      currentPrice: mockPrice,
      handleOnGuess: mockHandleOnGuess,
      isLoadingBTCPrice: false,
      gameState: {
        score: 0,
        lastGuess: null,
        canGuess: false,
      },
      countdown: 10,
    });

    render(<Game initialScore={0} />);

    expect(screen.getByRole("button", { name: /up/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /down/i })).toBeDisabled();
  });

  it("displays the last guess", () => {
    (useGameLogic as Mock).mockReturnValue({
      currentPrice: mockPrice,
      handleOnGuess: mockHandleOnGuess,
      isLoadingBTCPrice: false,
      gameState: {
        score: 0,
        lastGuess: {
          guess: Guess.Up,
          initialPrice: { amount: 4900000, currency: "USD", symbol: "$" },
        },
        canGuess: false,
      },
      countdown: 10,
    });

    render(<Game initialScore={0} />);

    expect(screen.getByText("⬆ Up")).toBeInTheDocument();
    expect(screen.getByText("US$49,000.00")).toBeInTheDocument();
  });

  it("displays the countdown", () => {
    (useGameLogic as Mock).mockReturnValue({
      currentPrice: mockPrice,
      handleOnGuess: mockHandleOnGuess,
      isLoadingBTCPrice: false,
      gameState: {
        score: 0,
        lastGuess: {
          guess: Guess.Up,
          initialPrice: { amount: 4900000, currency: "USD", symbol: "$" },
        },
        canGuess: false,
      },
      countdown: 5,
    });

    render(<Game initialScore={0} />);

    expect(screen.getByText("Guessing is disabled now. Remaining time: 5...")).toBeInTheDocument();
  });

  it("displays the guess's final result", () => {
    (useGameLogic as Mock).mockReturnValue({
      currentPrice: mockPrice,
      handleOnGuess: mockHandleOnGuess,
      isLoadingBTCPrice: false,
      gameState: {
        score: 0,
        lastGuess: {
          guess: Guess.Up,
          initialPrice: { amount: 4900000, currency: "USD", symbol: "$" },
          finalPrice: { amount: 4950000, currency: "USD", symbol: "$" },
          variance: 1,
        },
        canGuess: false,
      },
      countdown: 0,
    });

    render(<Game initialScore={0} />);

    expect(screen.getByText("⬆ Up")).toBeInTheDocument();
    expect(screen.getByText("US$49,000.00")).toBeInTheDocument();
    expect(screen.getByText("US$49,500.00")).toBeInTheDocument();
    expect(screen.getByTestId("result-correct")).toBeInTheDocument();
  });
});
