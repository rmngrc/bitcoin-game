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

## Deploying the Project

All the deployment is done for you from a Github Action. You can find its implementation at
[./github/workflows/deploy.yml](../../.github/workflows/deploy.yml)
