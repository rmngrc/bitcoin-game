interface ScoreBoardProps {
  score: number;
}

export const ScoreBoard = ({ score }: ScoreBoardProps) => {
  return <p className="text-lg text-gray-700 font-medium">Your Score: {score}</p>;
};
