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
    <div className="p-4 bg-gray-100 rounded-xl shadow-md text-gray-900 text-sm">
      <h3 className="text-lg font-semibold mb-2">Previous Guess</h3>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Your Guess:</span>
        <strong className={lastGuess.guess === "up" ? "text-green-500" : "text-red-500"}>
          {lastGuess.guess === "up" ? "⬆ Up" : "⬇ Down"}
        </strong>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">BTC Price at Guess:</span>
        <strong>
          {formatPrice(lastGuess.initialPrice.amount, lastGuess.initialPrice.currency)}
        </strong>
      </div>

      {lastGuess.finalPrice && (
        <div className="flex items-center space-x-2" data-testid="final-price">
          <span className="text-gray-600">Resolved Price:</span>
          <strong>{formatPrice(lastGuess.finalPrice.amount, lastGuess.finalPrice.currency)}</strong>
        </div>
      )}

      {lastGuess.variance !== undefined && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-gray-600">Result:</span>
          {lastGuess.variance > 0 && (
            <span className="text-green-600 font-semibold" data-testid="result-correct">
              ✅ Correct! +{lastGuess.variance} points! 🥳
            </span>
          )}
          {lastGuess.variance === 0 && (
            <span className="text-gray-600 font-semibold" data-testid="result-equal">
              ⚖ Equal! {lastGuess.variance} points! 😭
            </span>
          )}
          {lastGuess.variance < 0 && (
            <span className="text-red-600 font-semibold" data-testid="result-wrong">
              ❌ Wrong! {lastGuess.variance} points! 😐
            </span>
          )}
        </div>
      )}
    </div>
  );
};
