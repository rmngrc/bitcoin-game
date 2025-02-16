import { Guess, ScoreRequest, ScoreResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useGetNewScore = () => {
  return useMutation({
    mutationKey: ["get-new-score"],
    mutationFn: async ({
      previousPrice,
      newPrice,
      guess,
    }: {
      previousPrice: number;
      newPrice: number;
      guess: Guess;
    }): Promise<ScoreResponse> => {
      const request: ScoreRequest = { previousPrice, newPrice, guess };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/score`, {
        method: "POST",
        body: JSON.stringify(request),
        // This is sadly necessary as I do not have any domain to set the CORS headers.
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve score");
      }

      return response.json();
    },
  });
};
