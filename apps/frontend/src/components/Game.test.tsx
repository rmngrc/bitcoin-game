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
});
