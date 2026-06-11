export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getDiscountDetails(price: number, originalPrice: number) {
  const savings = originalPrice - price;
  const percentageOff = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;
  return {
    savings,
    percentageOff
  };
}
