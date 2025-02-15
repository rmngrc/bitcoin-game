import { Game } from "./components/Game";
import { GameLoader } from "./components/GameLoader";
import { AppProvider } from "./providers/AppProvider";

export const App = () => {
  return (
    <AppProvider>
      <GameLoader>{(initialScore) => <Game initialScore={initialScore} />}</GameLoader>
    </AppProvider>
  );
};
