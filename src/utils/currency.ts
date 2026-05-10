export type CurrencyCode = string;

const fallbackSymbols: Record<string, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  NZD: 'NZ$',
  CAD: 'C$',
  SGD: 'S$',
  AED: 'د.إ',
  SAR: '﷼',
  JPY: '¥',
  CNY: '¥',
  HKD: 'HK$',
  CHF: 'CHF',
  ZAR: 'R',
  MYR: 'RM',
  THB: '฿',
};

export function convertUsdPrice(usdPrice: number, rate: number) {
  return Math.round(Number(usdPrice || 0) * Number(rate || 1));
}

export function formatPrice(amount: number, currency: CurrencyCode) {
  const safeCurrency = currency || 'USD';

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    const symbol = fallbackSymbols[safeCurrency] || `${safeCurrency} `;
    return `${symbol}${Math.round(amount).toLocaleString('en-US')}`;
  }
}
