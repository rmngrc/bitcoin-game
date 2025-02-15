import { Guess } from "@/types";
import { twMerge } from "tailwind-merge";

interface GuessControlsProps {
  countdown: number;
  disabled: boolean;
  onGuess: (guess: Guess) => Promise<void>;
}

export const GuessControls = ({ countdown, disabled, onGuess }: GuessControlsProps) => {
  return (
    <div className="flex flex-col space-x-4 gap-10">
      <div className="flex w-full gap-4">
        <button
          onClick={() => onGuess(Guess.Up)}
          disabled={disabled}
          className={twMerge(
            "flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-80",
          )}
        >
          It will go up ⬆
        </button>
        <button
          onClick={() => onGuess(Guess.Down)}
          disabled={disabled}
          className={
            "flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl shadow-md transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-80"
          }
        >
          It will go down ⬇
        </button>
      </div>
      {countdown > 0 && <p>Guessing is disabled now. Remaining time: {countdown}...</p>}
      {countdown === 0 && <p>What do you think will happen with the price in the next minute?</p>}
    </div>
  );
};
