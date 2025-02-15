interface ScoreBoardProps {
  score: number;
}

export const ScoreBoard = ({ score }: ScoreBoardProps) => {
  return (
    <div className="mb-4">
      <div className="text-xl">Your Score: {score}</div>
    </div>
  );
};
