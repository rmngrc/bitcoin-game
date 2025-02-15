import { StartResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useStartGame = () => {
  return useQuery<StartResponse>({
    queryKey: ["start"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/start`, {
        // This is sadly necessary as I do not have any domain to set the CORS headers.
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to start game");
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
};
