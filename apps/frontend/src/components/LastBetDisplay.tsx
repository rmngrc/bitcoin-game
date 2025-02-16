import { formatPrice } from "@/lib/utils";
import { Guess, LastBet } from "@/types";

interface LastBetDisplayProps {
  lastBet: LastBet | null;
}

export const LastBetDisplay = ({ lastBet }: LastBetDisplayProps) => {
  if (!lastBet) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md text-gray-900 text-sm">
      <h3 className="text-lg font-semibold mb-2">Previous Guess</h3>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">Your Guess:</span>
        <strong className={lastBet.guess === Guess.Up ? "text-green-500" : "text-red-500"}>
          {lastBet.guess === Guess.Up ? "⬆ Up" : "⬇ Down"}
        </strong>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-gray-600">BTC Price at Guess:</span>
        <strong>{formatPrice(lastBet.initialPrice.amount, lastBet.initialPrice.currency)}</strong>
      </div>

      {lastBet.finalPrice && (
        <div className="flex items-center space-x-2" data-testid="final-price">
          <span className="text-gray-600">Resolved Price:</span>
          <strong>{formatPrice(lastBet.finalPrice.amount, lastBet.finalPrice.currency)}</strong>
        </div>
      )}

      {lastBet.variance !== undefined && (
        <div className="mt-3 flex items-center space-x-2">
          <span className="text-gray-600">Result:</span>
          {lastBet.variance > 0 && (
            <span className="text-green-600 font-semibold" data-testid="result-correct">
              ✅ Correct! +{lastBet.variance} points! 🥳
            </span>
          )}
          {lastBet.variance === 0 && (
            <span className="text-gray-600 font-semibold" data-testid="result-equal">
              ⚖ Equal! {lastBet.variance} points! 😭
            </span>
          )}
          {lastBet.variance < 0 && (
            <span className="text-red-600 font-semibold" data-testid="result-wrong">
              ❌ Wrong! {lastBet.variance} points! 😐
            </span>
          )}
        </div>
      )}
    </div>
  );
};
