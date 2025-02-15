import { renderWithProviders } from "@/test-utils";
import { server } from "@/test-utils/server/node";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { GameLoader } from "./GameLoader";

describe("GameLoader", () => {
  it("renders loading state", async () => {
    server.boundary(async () => {
      renderWithProviders(
        <GameLoader>{(initialScore) => <div>Game Content: {initialScore}</div>}</GameLoader>,
      );

      expect(await screen.findByText("Loading game...")).toBeInTheDocument();
    });
  });

  it("renders error state", async () => {
    server.boundary(async () => {
      server.use(
        http.get("/start", () => {
          return HttpResponse.json({ error: "Failed to start game" }, { status: 500 });
        }),
      );

      renderWithProviders(
        <GameLoader>{(initialScore) => <div>Game Content: {initialScore}</div>}</GameLoader>,
      );

      expect(await screen.findByText("Error loading game")).toBeInTheDocument();
    });
  });

  it("renders children when not loading and no error", async () => {
    server.boundary(async () => {
      renderWithProviders(
        <GameLoader>{(initialScore) => <div>Game Content: {initialScore}</div>}</GameLoader>,
      );

      expect(await screen.findByText("Game Content 0")).toBeInTheDocument();
    });
  });
});
