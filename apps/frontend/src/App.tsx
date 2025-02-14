import { AppProvider } from "./providers/AppProvider";

export const App = () => {
  return (
    <AppProvider>
      <div>
        <h1>Bitcoin Game</h1>
      </div>
    </AppProvider>
  );
};
