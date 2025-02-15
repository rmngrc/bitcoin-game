import { SECONDS_BETWEEN_GUESSES } from "@/lib/utils";
import { Guess } from "@/types";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { useCountdown } from "./useCountdown";
import { useGameLogic } from "./useGameLogic";
import { useGetBitcoinPrice } from "./useGetBitcoinPrice";
import { useGetNewScore } from "./useGetNewScore";

vi.mock("./useGetBitcoinPrice");
vi.mock("./useCountdown");
vi.mock("./useGetNewScore");

describe("useGameLogic", () => {
  const mockPrice = { amount: 5000000, currency: "USD", symbol: "$" };
  const mockGetNewScore = vi.fn().mockResolvedValue({ score: 100, variance: 1 });

  (useGetBitcoinPrice as Mock).mockReturnValue({
    data: mockPrice,
    isLoading: false,
  });
  (useGetNewScore as Mock).mockReturnValue(mockGetNewScore);
  (useCountdown as Mock).mockReturnValue({
    countdown: -1,
    resetCountdown: vi.fn(),
    startCountdown: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with the correct state", () => {
    const { result } = renderHook(() => useGameLogic({ initialScore: 10 }));

    expect(result.current).toEqual({
      countdown: -1,
      currentPrice: mockPrice,
      gameState: {
        score: 10,
        lastGuess: null,
        canGuess: true,
      },
      handleOnGuess: expect.any(Function),
      isLoadingBTCPrice: false,
    });
  });

  it("handles a guess correctly", async () => {
    setCountdownTo(-1);

    const { result } = renderHook(() => useGameLogic({ initialScore: 0 }));

    await act(async () => {
      await result.current.handleOnGuess(Guess.Up);
    });

    expect(useCountdown().startCountdown).toHaveBeenCalled();
    expect(result.current).toEqual({
      countdown: -1,
      currentPrice: mockPrice,
      gameState: {
        score: 0,
        lastGuess: { initialPrice: mockPrice, guess: Guess.Up },
        canGuess: false,
      },
      handleOnGuess: expect.any(Function),
      isLoadingBTCPrice: false,
    });
  });

  it("updates state correctly when countdown reaches zero", async () => {
    setCountdownTo(-1);

    const { result, rerender } = renderHook(() => useGameLogic({ initialScore: 0 }));

    await act(async () => {
      await result.current.handleOnGuess(Guess.Up);
    });

    setCountdownTo(SECONDS_BETWEEN_GUESSES);

    rerender();

    await waitFor(() => {
      expect(result.current.countdown).toBe(SECONDS_BETWEEN_GUESSES);
    });

    setCountdownTo(0);

    rerender();

    await waitFor(() => {
      expect(result.current.countdown).toBe(0);
    });

    expect(mockGetNewScore).toHaveBeenCalledWith({
      previousPrice: mockPrice.amount,
      newPrice: mockPrice.amount,
      guess: "up",
    });

    expect(result.current).toEqual({
      countdown: 0,
      currentPrice: mockPrice,
      gameState: {
        score: 100,
        lastGuess: { initialPrice: mockPrice, finalPrice: mockPrice, guess: Guess.Up, variance: 1 },
        canGuess: true,
      },
      handleOnGuess: expect.any(Function),
      isLoadingBTCPrice: false,
    });

    expect(useCountdown().resetCountdown).toHaveBeenCalled();
  });
});

function setCountdownTo(seconds: number) {
  (useCountdown as Mock).mockReturnValue({
    countdown: seconds,
    resetCountdown: vi.fn(),
    startCountdown: vi.fn(),
  });
}
