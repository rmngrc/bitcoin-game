import { PriceDisplay } from "@/components/PriceDisplay";
import { useGameLogic } from "@/hooks/useGameLogic";
import { GuessControls } from "./GuessControls";
import { LastGuessDisplay } from "./LastGuessDisplay";
import { ScoreBoard } from "./ScoreBoard";

interface GameProps {
  initialScore: number;
}

export const Game = ({ initialScore = 0 }: GameProps) => {
  const { currentPrice, handleOnGuess, isLoadingBTCPrice, gameState, countdown } = useGameLogic({
    initialScore,
  });

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center flex flex-col gap-6">
      <PriceDisplay price={currentPrice} isLoading={isLoadingBTCPrice} />
      <ScoreBoard score={gameState.score} />
      <GuessControls countdown={countdown} disabled={!gameState.canGuess} onGuess={handleOnGuess} />
      <LastGuessDisplay lastGuess={gameState.lastGuess} />
    </div>
  );
};
