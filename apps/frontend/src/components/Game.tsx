import { PriceDisplay } from "@/components/PriceDisplay";
import { useGetBitcoinPrice } from "@/hooks/useGetBitcoinPrice";

interface GameProps {
  initialScore: number;
}

export const Game = ({ initialScore = 0 }: GameProps) => {
  const { data: currentPrice, isLoading } = useGetBitcoinPrice();

  return (
    <div className="flex flex-col gap-8 items-center justify-center my-8">
      <PriceDisplay price={currentPrice} isLoading={isLoading} />
    </div>
  );
};
