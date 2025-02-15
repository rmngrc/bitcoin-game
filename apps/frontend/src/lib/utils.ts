export function formatPrice(amount: number, currency: string) {
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount / 100);
}
