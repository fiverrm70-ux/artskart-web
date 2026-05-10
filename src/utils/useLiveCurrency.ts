import { useEffect, useState } from 'react';
import axios from 'axios';

import type { CurrencyCode } from './currency';
import { convertUsdPrice, formatPrice } from './currency';

type IpApiResponse = {
  currency?: string;
  country_code?: string;
};

type RatesResponse = {
  rates?: Record<string, number>;
};

const FALLBACK_CURRENCY = 'USD';
const FALLBACK_RATE = 1;

const STORAGE_CURRENCY_KEY = 'artskart_currency';
const STORAGE_RATE_KEY = 'artskart_currency_rate';
const STORAGE_TIME_KEY = 'artskart_currency_time';

const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

function getTimezoneCurrencyFallback(): CurrencyCode {
  try {
    const locale = (navigator.language || '').toUpperCase();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';

    if (
      locale.includes('IN') ||
      timezone.includes('Kolkata') ||
      timezone.includes('Calcutta')
    )
      return 'INR';

    if (
      locale.includes('NL') ||
      locale.includes('DE') ||
      locale.includes('FR') ||
      locale.includes('ES') ||
      locale.includes('IT') ||
      locale.includes('PT') ||
      locale.includes('BE') ||
      locale.includes('AT') ||
      locale.includes('FI') ||
      locale.includes('IE') ||
      locale.includes('GR') ||
      timezone.includes('Amsterdam') ||
      timezone.includes('Berlin') ||
      timezone.includes('Paris') ||
      timezone.includes('Madrid') ||
      timezone.includes('Rome') ||
      timezone.includes('Vienna') ||
      timezone.includes('Dublin')
    ) {
      return 'EUR';
    }

    if (locale.includes('GB') || timezone.includes('London')) return 'GBP';
    if (
      locale.includes('AU') ||
      timezone.includes('Sydney') ||
      timezone.includes('Melbourne')
    )
      return 'AUD';
    if (locale.includes('NZ') || timezone.includes('Auckland')) return 'NZD';
    if (
      locale.includes('CA') ||
      timezone.includes('Toronto') ||
      timezone.includes('Vancouver')
    )
      return 'CAD';
    if (locale.includes('SG') || timezone.includes('Singapore')) return 'SGD';
    if (timezone.includes('Dubai')) return 'AED';
    if (timezone.includes('Riyadh')) return 'SAR';
    if (locale.includes('JP') || timezone.includes('Tokyo')) return 'JPY';
    if (locale.includes('CN') || timezone.includes('Shanghai')) return 'CNY';
    if (locale.includes('HK') || timezone.includes('Hong_Kong')) return 'HKD';
    if (locale.includes('CH') || timezone.includes('Zurich')) return 'CHF';
    if (locale.includes('ZA') || timezone.includes('Johannesburg'))
      return 'ZAR';
    if (locale.includes('MY') || timezone.includes('Kuala_Lumpur'))
      return 'MYR';
    if (locale.includes('TH') || timezone.includes('Bangkok')) return 'THB';

    return FALLBACK_CURRENCY;
  } catch {
    return FALLBACK_CURRENCY;
  }
}

function getCachedCurrency() {
  try {
    const currency = localStorage.getItem(STORAGE_CURRENCY_KEY);
    const rate = Number(localStorage.getItem(STORAGE_RATE_KEY));
    const savedTime = Number(localStorage.getItem(STORAGE_TIME_KEY));

    const isValidCache =
      currency &&
      rate &&
      Number.isFinite(rate) &&
      savedTime &&
      Date.now() - savedTime < CACHE_DURATION;

    if (!isValidCache) return null;

    return {
      currency,
      rate,
    };
  } catch {
    return null;
  }
}

function saveCurrencyCache(currency: CurrencyCode, rate: number) {
  try {
    localStorage.setItem(STORAGE_CURRENCY_KEY, currency);
    localStorage.setItem(STORAGE_RATE_KEY, String(rate));
    localStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
  } catch {
    // ignore localStorage failure
  }
}

export function useLiveCurrency() {
  const cached = getCachedCurrency();

  const [currency, setCurrency] = useState<CurrencyCode>(
    cached?.currency || getTimezoneCurrencyFallback(),
  );

  const [rate, setRate] = useState<number>(cached?.rate || FALLBACK_RATE);

  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;

    async function loadCurrency() {
      try {
        let detectedCurrency: CurrencyCode = getTimezoneCurrencyFallback();

        try {
          const ipResponse = await axios.get<IpApiResponse>(
            'https://ipapi.co/json/',
            {
              timeout: 5000,
            },
          );

          if (ipResponse.data?.currency) {
            detectedCurrency = String(ipResponse.data.currency).toUpperCase();
          }
        } catch {
          detectedCurrency = getTimezoneCurrencyFallback();
        }

        const ratesResponse = await axios.get<RatesResponse>(
          'https://open.er-api.com/v6/latest/USD',
          {
            timeout: 6000,
          },
        );

        const liveRate = ratesResponse.data?.rates?.[detectedCurrency];

        if (!mounted) return;

        if (liveRate && Number.isFinite(liveRate)) {
          setCurrency(detectedCurrency);
          setRate(liveRate);
          saveCurrencyCache(detectedCurrency, liveRate);
        } else {
          setCurrency(FALLBACK_CURRENCY);
          setRate(FALLBACK_RATE);
          saveCurrencyCache(FALLBACK_CURRENCY, FALLBACK_RATE);
        }
      } catch {
        if (!mounted) return;

        const fallbackCurrency = getTimezoneCurrencyFallback();

        setCurrency(fallbackCurrency);
        setRate(FALLBACK_RATE);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCurrency();

    return () => {
      mounted = false;
    };
  }, []);

  function price(usdPrice: number) {
    const converted = convertUsdPrice(usdPrice, rate);
    return formatPrice(converted, currency);
  }

  return {
    currency,
    rate,
    loading,
    price,
    setCurrency,
  };
}
