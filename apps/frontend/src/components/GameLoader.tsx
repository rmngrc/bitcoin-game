import { useStartGame } from "@/hooks/useStartGame";
import { ReactNode } from "react";

interface GameLoaderProps {
  children: (initialScore: number) => ReactNode;
}

export const GameLoader = ({ children }: GameLoaderProps) => {
  const { data: gameData, isLoading, isError } = useStartGame();

  if (isLoading) {
    return <div>Loading game...</div>;
  }

  if (isError) {
    return <div>Error loading game</div>;
  }

  if (gameData) {
    return <>{children(gameData.score)}</>;
  }

  return null;
};
