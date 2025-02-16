import { Guess, LastGuess, Price } from "@/types";
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
  const { isPending: isUpdatingScore, mutateAsync: getNewScore } = useGetNewScore();
  const [gameState, setGameState] = useState<GameState>({
    score: initialScore,
    lastGuess: null,
    canGuess: true,
  });

  useEffect(() => {
    const canResolveGuess = !isUpdatingScore && countdown === 0 && currentPrice;

    if (!canResolveGuess) {
      return;
    }

    // Updating the state when we reach the end of the countdown.
    // Calling resetCountdown to avoid getting the function called more than once.
    handleGuessResult({ currentPrice, getNewScore, currentState: gameState }).then((newState) => {
      resetCountdown();
      setGameState(newState);
    });
  }, [countdown, currentPrice, getNewScore, isUpdatingScore, resetCountdown, gameState]);

  const handleOnGuess = useCallback(
    async (guess: Guess) => {
      const isAbleToGuess = gameState.canGuess && currentPrice;

      if (!isAbleToGuess) {
        return;
      }

      startCountdown();

      setGameState((prevState) => ({
        ...prevState,
        lastGuess: {
          initialPrice: currentPrice,
          guess,
        },
        canGuess: false,
      }));
    },
    [currentPrice, startCountdown, gameState],
  );

  return {
    countdown,
    currentPrice,
    gameState,
    handleOnGuess,
    isLoadingBTCPrice,
  };
};

interface HandleGuessResultProps {
  currentPrice: Price;
  currentState: GameState;
  getNewScore: ReturnType<typeof useGetNewScore>["mutateAsync"];
}

// Moving this function outside of the component lifecycle so that
// we are not affecting the performance of the component. By doing this,
// the function does not need to mutate if any of the props change.
const handleGuessResult = async ({
  currentPrice,
  currentState,
  getNewScore,
}: HandleGuessResultProps) => {
  const finalPrice: Price = currentPrice;

  // Attention: currentState.lastGuess cannot be null here as to get
  // to this point there should have been a previous guess. However,
  // Typescript is not smart enough to know that.
  const lastGuess = currentState.lastGuess!;

  const { score, variance } = await getNewScore({
    previousPrice: lastGuess.initialPrice.amount,
    newPrice: finalPrice.amount,
    guess: lastGuess.guess,
  });

  return {
    ...currentState,
    canGuess: true,
    lastGuess: { ...lastGuess, finalPrice, variance },
    score,
  };
};
