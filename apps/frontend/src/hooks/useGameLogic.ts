import { Guess, LastGuess, Price } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useCountdown } from "./useCountdown";
import { useGetBitcoinPrice } from "./useGetBitcoinPrice";
import { useGetNewScore } from "./useGetNewScore";

interface GameState {
  canBet: boolean;
  score: number;
  lastGuess: LastGuess | null;
}

export const useGameLogic = ({ initialScore = 0 }) => {
  const { data: currentPrice, isLoading: isLoadingBTCPrice } = useGetBitcoinPrice();
  const { countdown, resetCountdown, startCountdown } = useCountdown();
  const { isPending: isUpdatingScore, mutateAsync: getNewScore } = useGetNewScore();
  const [gameState, setGameState] = useState<GameState>({
    score: initialScore,
    lastGuess: null,
    canBet: true,
  });

  useEffect(() => {
    const canResolveBet = !isUpdatingScore && countdown === 0 && currentPrice;

    if (!canResolveBet) {
      return;
    }

    // Updating the state when we reach the end of the countdown.
    // Calling resetCountdown to avoid getting the function called more than once.
    handleBetResult({ currentPrice, getNewScore, currentState: gameState }).then((newState) => {
      resetCountdown();
      setGameState(newState);
    });
  }, [countdown, currentPrice, getNewScore, isUpdatingScore, resetCountdown, gameState]);

  const handleOnBet = useCallback(
    async (guess: Guess) => {
      const isAbleToBet = gameState.canBet && currentPrice;

      if (!isAbleToBet) {
        return;
      }

      startCountdown();

      setGameState((prevState) => ({
        ...prevState,
        lastGuess: {
          initialPrice: currentPrice,
          guess,
        },
        canBet: false,
      }));
    },
    [currentPrice, startCountdown, gameState],
  );

  return {
    currentPrice,
    isLoadingBTCPrice,
    gameState,
    countdown,
    handleOnBet: handleOnBet,
  };
};

interface HandleBetResultProps {
  currentPrice: Price;
  currentState: GameState;
  getNewScore: ReturnType<typeof useGetNewScore>["mutateAsync"];
}

// Moving this function outside of the component lifecycle so that
// we are not affecting the performance of the component. By doing this,
// the function does not need to mutate if any of the props change.
const handleBetResult = async ({
  currentPrice,
  currentState,
  getNewScore,
}: HandleBetResultProps) => {
  const finalPrice: Price = currentPrice;

  // Attention: currentState.lastGuess cannot be null here as to get
  // to this point there should have been a previous bet. However,
  // Typescript is not smart enough to know that.
  const lastGuess = currentState.lastGuess!;

  const { score, variance } = await getNewScore({
    previousPrice: lastGuess.initialPrice.amount,
    newPrice: finalPrice.amount,
    guess: lastGuess.guess,
  });

  return {
    ...currentState,
    canBet: true,
    lastGuess: { ...lastGuess, finalPrice, variance },
    score,
  };
};
