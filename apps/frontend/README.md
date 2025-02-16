# Bitcoin Game Frontend

## Getting Started

To work on the frontend part of the project, you just need to run the following from the root of the
project. This will bring up the development server for you:

```sh
npm run dev --workspace=frontend
```

## Technology Choices

- TDD as development approach.
- React Query as data-fetching library which allows for retries and polling in a very idiomatic way.
- Tailwind to style the UI.
- Most of the components have been kept presentational, and all the game logic has been moved to
  hooks (business logic belongs there).

## App Architecture

Since the application uses React Query as the data fetching library, we could simplify a lot the
logic and the application states. The most interesting part of the implementation is how the game
logic is split between a few hooks. This helped us **keep all components presentational**.

- **useCountdown**: this is the one in charge of maintaining the countdown (with an interval).
- **useGameLogic**: this is the one that keeps the game logic. Allows to submit a guess and resolve
  guesses based on the game rules.
- **useGetBitcoinPrice**: just using react query to fetch the most updated Bitcoin price. It uses
  long polling to keep the price updated (polling frequency is 5 seconds).
- **useGetNewScore**: react query mutation in charge of the backend when a guess has been submitted
  and retrieve the updated game score.
- **useStartGame**: a query to start the game. It will always return the initial score of the user
  (whether its their first time or not).

## Deploying the Project

All the deployment is done for you from a Github Action. You can find its implementation at
[./github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
