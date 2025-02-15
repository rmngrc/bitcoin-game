import { GameLoader } from "./components/GameLoader";
import { AppProvider } from "./providers/AppProvider";

export const App = () => {
  return (
    <AppProvider>
      <GameLoader>
        {(initialScore) => (
          <div>
            <h1>Bitcoin Game</h1>
            <div>Your Score: {initialScore}</div>
          </div>
        )}
      </GameLoader>
    </AppProvider>
  );
};
