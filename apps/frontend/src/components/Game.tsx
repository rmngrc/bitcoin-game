import { PriceDisplay } from "@/components/PriceDisplay";
import { useGetBitcoinPrice } from "@/hooks/useGetBitcoinPrice";
import { Guess } from "@/types";
import { GuessControls } from "./GuessControls";
import { ScoreBoard } from "./ScoreBoard";

interface GameProps {
  initialScore: number;
}

export const Game = ({ initialScore = 0 }: GameProps) => {
  const { data: currentPrice, isLoading } = useGetBitcoinPrice();

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-8">
      <PriceDisplay price={currentPrice} isLoading={isLoading} />
      <ScoreBoard score={0} />
      <GuessControls
        countdown={0}
        disabled={true}
        onGuess={async (guess: Guess) => console.log(guess)}
      />
    </div>
  );
};
