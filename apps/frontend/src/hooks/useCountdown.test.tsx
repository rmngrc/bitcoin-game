import { SECONDS_BETWEEN_GUESSES } from "@/constants";
import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

describe("useCountdown", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("initializes countdown correctly", () => {
    const { result } = renderHook(() => useCountdown());

    expect(result.current.countdown).toBe(-1);
  });

  it("starts countdown correctly", async () => {
    const secondsToCount = SECONDS_BETWEEN_GUESSES;
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown();
    });

    for (let i = secondsToCount; i > 0; i--) {
      expect(result.current.countdown).toBe(i);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
  });

  it("resets countdown correctly", async () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.startCountdown();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.resetCountdown();
    });

    expect(result.current.countdown).toBe(-1);
  });
});
