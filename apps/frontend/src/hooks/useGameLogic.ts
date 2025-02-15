import { Guess, LastGuess, Price, ScoreResponse } from "@/types";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useGetBitcoinPrice } from "./useGetBitcoinPrice";
import { useGetNewScore } from "./useGetNewScore";

interface GameState {
  canGuess: boolean;
  score: number;
  lastGuess: LastGuess | null;
}

export const useGameLogic = ({ initialScore = 0 }) => {
  const { data: currentPrice, isLoading: isLoadingBTCPrice } = useGetBitcoinPrice();
  const { countdown, resetCountdown, startCountdown } = useCountdown();
  const getNewScore = useGetNewScore();

  const [state, setState] = useState<GameState>({
    score: initialScore,
    lastGuess: null,
    canGuess: true,
  });

  useEffect(() => {
    if (isLoadingBTCPrice || currentPrice === undefined) {
      return; // Wait until the price is loaded
    }

    // Updating the state when we reach the end of the countdown.
    // Calling resetCountdown to avoid getting the function called more than once.
    if (countdown === 0 && currentPrice) {
      handleGuessResult({ currentPrice, getNewScore, state, setState });
      resetCountdown();
    }
  }, [countdown, currentPrice, getNewScore, isLoadingBTCPrice, resetCountdown, state]);

  const handleOnGuess = useCallback(
    async (guess: Guess) => {
      if (!state.canGuess || !currentPrice) {
        return;
      }

      const lastGuess: LastGuess = {
        initialPrice: currentPrice,
        guess,
      };

      startCountdown();

      setState((prevState) => ({
        ...prevState,
        lastGuess,
        canGuess: false,
      }));
    },
    [currentPrice, startCountdown, state],
  );

  return {
    currentPrice,
    isLoadingBTCPrice,
    gameState: state,
    countdown,
    handleOnGuess,
  };
};

interface HandleGuessResultProps {
  currentPrice: Price;
  getNewScore: UseMutateAsyncFunction<
    ScoreResponse,
    Error,
    {
      previousPrice: number;
      newPrice: number;
      guess: Guess;
    },
    unknown
  >;
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

// Moving this function outside of the component lifecycle so that
// we are not affecting the performance of the component. By doing this,
// the function does not need to mutate if any of the props change.
const handleGuessResult = async ({
  currentPrice,
  getNewScore,
  state,
  setState,
}: HandleGuessResultProps) => {
  // Attention: currentPrice.current cannot be null here as to get
  // to this point there should have been a previous guess, and the
  // currentPrice ref only updates when the hook is able to fetch
  // the actuall value from the API. However, Typescript is not
  // smart enough to know that.
  const finalPrice: Price = currentPrice;
  const lastGuess = state.lastGuess!;

  const { score, variance } = await getNewScore({
    previousPrice: lastGuess.initialPrice.amount,
    newPrice: finalPrice.amount,
    guess: lastGuess.guess,
  });

  setState((prevState) => ({
    ...prevState,
    canGuess: true,
    lastGuess: { ...lastGuess, finalPrice, variance },
    score,
  }));
};
