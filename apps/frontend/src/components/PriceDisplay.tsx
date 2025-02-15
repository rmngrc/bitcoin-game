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
      <div className="text-2xl font-bold">
        The current Bitcoin Price is {formatPrice(price.amount, price.currency)}
      </div>
    );
  }

  return null;
};
