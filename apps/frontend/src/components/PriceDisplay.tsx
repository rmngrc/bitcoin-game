import { formatPrice } from "@/lib/utils";
import { Price } from "@/types";

interface PriceDisplayProps {
  price?: Price;
  isLoading: boolean;
}

export const PriceDisplay = ({ price, isLoading }: PriceDisplayProps) => {
  if (isLoading) {
    return <div data-testid="loading-price">Loading Bitcoin price...</div>;
  }

  if (price) {
    return (
      <h1 className="text-2xl font-bold text-gray-900">
        The current Bitcoin Price is{" "}
        <span className="text-blue-600">{formatPrice(price.amount, price.currency)}</span>
      </h1>
    );
  }

  return null;
};
