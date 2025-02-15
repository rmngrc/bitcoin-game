import { Game } from "./components/Game";
import { GameLoader } from "./components/GameLoader";
import { AppProvider } from "./providers/AppProvider";

export const App = () => {
  return (
    <AppProvider>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <GameLoader>{(initialScore) => <Game initialScore={initialScore} />}</GameLoader>
      </div>
    </AppProvider>
  );
};
