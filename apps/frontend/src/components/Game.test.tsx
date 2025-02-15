import { SECONDS_BETWEEN_GUESSES } from "@/lib/utils";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/test-utils/server/node";
import { PriceResponse } from "@/types";
import { act, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Game } from "./Game";

const PRICE_URL = `${import.meta.env.VITE_API_URL}/price`;

describe("Game", () => {
  it("renders loading spinner on btc price", async () => {
    server.use(
      http.get(PRICE_URL, () => {
        const response: PriceResponse = {
          price: "94567.89",
        };

        return HttpResponse.json(response);
      }),
    );

    renderWithProviders(<Game initialScore={0} />);

    expect(await screen.findByText("Loading Bitcoin price...")).toBeInTheDocument();
  });

  it("renders btc price", async () => {
    server.use(
      http.get(PRICE_URL, () => {
        const response: PriceResponse = {
          price: "94567.89",
        };

        return HttpResponse.json(response);
      }),
    );

    renderWithProviders(<Game initialScore={0} />);

    expect(
      await screen.findByText("The current Bitcoin Price is US$94,567.89"),
    ).toBeInTheDocument();
  });

  describe("when there is no previous guess", () => {
    it("renders game content properly", async () => {
      server.use(
        http.get(PRICE_URL, () => {
          const response: PriceResponse = {
            price: "94567.89",
          };

          return HttpResponse.json(response);
        }),
      );

      renderWithProviders(<Game initialScore={0} />);

      expect(await screen.findByText("Your Score: 0")).toBeInTheDocument();
      expect(
        await screen.findByText("The current Bitcoin Price is US$94,567.89"),
      ).toBeInTheDocument();
      expect(await screen.findByRole("button", { name: /up/i })).toBeEnabled();
      expect(await screen.findByRole("button", { name: /down/i })).toBeEnabled();
    });

    it.skip(`disables buttons for ${SECONDS_BETWEEN_GUESSES} seconds after submitting a guess`, async () => {
      vi.useFakeTimers();

      server.use(
        http.get(PRICE_URL, () => {
          return HttpResponse.json({ symbol: "BTCUSDT", price: "94567.89" });
        }),
      );

      renderWithProviders(<Game initialScore={0} />);

      await act(async () => {
        vi.advanceTimersByTimeAsync(100);
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(screen.getByText("The current Bitcoin Price is US$94,567.89")).toBeInTheDocument();
      });

      const upButton = await screen.findByRole("button", { name: /up/i });

      await act(async () => {
        upButton.click();
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /up/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /down/i })).toBeDisabled();
      });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /up/i })).toBeDisabled();
        expect(screen.getByRole("button", { name: /down/i })).toBeDisabled();
      });
    });
  });
});
