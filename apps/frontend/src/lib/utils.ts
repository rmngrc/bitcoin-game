export const SECONDS_BETWEEN_GUESSES = 60;

export const MILISECONDS_BETWEEN_GUESSES = SECONDS_BETWEEN_GUESSES * 1000;

export function formatPrice(amount: number, currency: string) {
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount / 100);
}
