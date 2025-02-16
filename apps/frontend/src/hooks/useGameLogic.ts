import { Guess, LastBet, Price } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useGetBitcoinPrice } from "./useGetBitcoinPrice";
import { useGetNewScore } from "./useGetNewScore";

interface GameState {
  canBet: boolean;
  score: number;
  lastBet: LastBet | null;
}

export const useGameLogic = ({ initialScore = 0 }) => {
  const { data: currentPrice, isLoading: isLoadingBTCPrice } = useGetBitcoinPrice();
  const { countdown, resetCountdown, startCountdown } = useCountdown();
  const getNewScore = useGetNewScore();

  const [state, setState] = useState<GameState>({
    score: initialScore,
    lastBet: null,
    canBet: true,
  });

  useEffect(() => {
    const priceNotLoaded = isLoadingBTCPrice || currentPrice === undefined;
    const canResolveGuess = !state.canBet && countdown === 0 && currentPrice;

    if (priceNotLoaded) {
      // Wait until the price is loaded to resolve the guess.
      return;
    }

    // Updating the state when we reach the end of the countdown.
    // Calling resetCountdown to avoid getting the function called more than once.
    if (canResolveGuess) {
      handleBetResult({ currentPrice, getNewScore, currentState: state }).then((newState) => {
        setState(newState);
        resetCountdown();
      });
    }
  }, [countdown, currentPrice, getNewScore, isLoadingBTCPrice, resetCountdown, state]);

  const handleOnBet = useCallback(
    async (guess: Guess) => {
      const isAbleToGuess = state.canBet && currentPrice;

      if (!isAbleToGuess) {
        return;
      }

      startCountdown();

      setState((prevState) => ({
        ...prevState,
        lastBet: {
          initialPrice: currentPrice,
          guess,
        },
        canBet: false,
      }));
    },
    [currentPrice, startCountdown, state],
  );

  return {
    currentPrice,
    isLoadingBTCPrice,
    gameState: state,
    countdown,
    handleOnBet: handleOnBet,
  };
};

interface HandleBetResultProps {
  currentPrice: Price;
  currentState: GameState;
  getNewScore: ReturnType<typeof useGetNewScore>;
}

// Moving this function outside of the component lifecycle so that
// we are not affecting the performance of the component. By doing this,
// the function does not need to mutate if any of the props change.
const handleBetResult = async ({
  currentPrice,
  currentState,
  getNewScore,
}: HandleBetResultProps) => {
  // Attention: currentPrice.current cannot be null here as to get
  // to this point there should have been a previous guess, and the
  // currentPrice ref only updates when the hook is able to fetch
  // the actuall value from the API. However, Typescript is not
  // smart enough to know that.
  const finalPrice: Price = currentPrice;
  const lastBet = currentState.lastBet!;

  const { score, variance } = await getNewScore({
    previousPrice: lastBet.initialPrice.amount,
    newPrice: finalPrice.amount,
    guess: lastBet.guess,
  });

  return {
    ...currentState,
    canBet: true,
    lastBet: { ...lastBet, finalPrice, variance },
    score,
  };
};
