import { Guess } from "@/types";
import { twMerge } from "tailwind-merge";

interface GuessControlsProps {
  countdown: number;
  disabled: boolean;
  onGuess: (guess: Guess) => Promise<void>;
}

export const GuessControls = ({ countdown, disabled, onGuess }: GuessControlsProps) => {
  return (
    <div className="flex flex-col gap-4">
      {countdown > 0 && <p>Guessing is disabled now. Remaining time: {countdown}...</p>}
      {countdown === 0 && <p>What do you think will happen with the price in the next minute?</p>}
      <div className="flex w-full gap-4">
        <button
          onClick={() => onGuess(Guess.Up)}
          disabled={disabled}
          className={twMerge(
            "px-4 py-2 rounded disabled:opacity-50 border-0.5 bg-[#4CAF50] hover:opacity-90 w-1/2 text-white",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          I think it'll go up 👍
        </button>
        <button
          onClick={() => onGuess(Guess.Down)}
          disabled={disabled}
          className={twMerge(
            "px-4 py-2 rounded disabled:opacity-50 border-0.5 bg-[#F44336] hover:opacity-90 w-1/2 text-white",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          I think it'll go down 👎
        </button>
      </div>
    </div>
  );
};
