import { PriceResponse, Price } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetBitcoinPrice = () => {
  return useQuery<Price>({
    queryKey: ["bitcoin-price"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/price`, {
        // This is sadly necessary as I do not have any domain to set the CORS headers.
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bitcoin price");
      }

      const data: PriceResponse = await response.json();
      return adaptPriceResponse(data);
    },
    refetchInterval: 5000,
  });
};

function adaptPriceResponse(data: PriceResponse): Price {
  return {
    amount: Math.trunc(parseFloat(data.price) * 100),
    currency: "USD",
    symbol: "BTC",
  };
}
