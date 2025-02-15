import { formatPrice } from "@/lib/utils";
import { LastGuess } from "@/types";

interface LastGuessDisplayProps {
  lastGuess: LastGuess | null;
}

export const LastGuessDisplay = ({ lastGuess }: LastGuessDisplayProps) => {
  if (!lastGuess) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <div>
        Your last guess was {lastGuess.guess} with BTC price of{" "}
        {formatPrice(lastGuess.initialPrice.amount, lastGuess.initialPrice.currency)}
      </div>
      {lastGuess.finalPrice && (
        <div>
          Guess was resolved at price:{" "}
          {formatPrice(lastGuess.finalPrice.amount, lastGuess.finalPrice.currency)}
        </div>
      )}
      {lastGuess.variance !== undefined && (
        <div>
          Last guess was:{" "}
          {lastGuess.variance > 0 && (
            <span className="text-green-600">Correct! +{lastGuess.variance} points!</span>
          )}
          {lastGuess.variance < 0 && (
            <span className="text-red-600">Wrong! {lastGuess.variance} points!</span>
          )}
          {lastGuess.variance === 0 && (
            <span className="text-gray-600">Equal! {lastGuess.variance} points!</span>
          )}
        </div>
      )}
    </div>
  );
};
