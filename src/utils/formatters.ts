import { Currency } from '../types';

export const FX_RATES = {
  MXN: 1,
  USD: 18.25, // 1 USD = 18.25 MXN
  EUR: 19.80, // 1 EUR = 19.80 MXN
};

export function convertFromMxn(amountMxn: number, targetCurrency: Currency): number {
  if (targetCurrency === 'MXN') return amountMxn;
  return amountMxn / FX_RATES[targetCurrency];
}

export function formatCurrency(
  amountMxn: number,
  currency: Currency = 'MXN',
  isDiscreet: boolean = false
): string {
  if (isDiscreet) {
    return `•••••••• ${currency}`;
  }

  const converted = convertFromMxn(amountMxn, currency);
  
  const formatter = new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(converted)} ${currency}`;
}

export function formatNumber(
  num: number,
  isDiscreet: boolean = false
): string {
  if (isDiscreet) return '••••••';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatArea(
  m2: number,
  isDiscreet: boolean = false
): string {
  if (isDiscreet) return '•••• m²';
  return `${new Intl.NumberFormat('en-US').format(m2)} m²`;
}

export interface ExpiryStatus {
  daysLeft: number | null;
  label: string;
  isUrgent: boolean;
  isWarning: boolean;
  isExpired: boolean;
}

export function getExpiryStatus(expiryDateStr?: string, lang: 'en' | 'es' = 'en'): ExpiryStatus {
  if (!expiryDateStr) {
    return {
      daysLeft: null,
      label: lang === 'es' ? 'Sin vigencia fijada' : 'No expiry set',
      isUrgent: false,
      isWarning: false,
      isExpired: false,
    };
  }

  const expiry = new Date(expiryDateStr);
  const now = new Date();
  // Normalize dates to midnight for fair day count
  expiry.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      daysLeft,
      label: lang === 'es' ? `Expiró hace ${Math.abs(daysLeft)}d` : `Expired ${Math.abs(daysLeft)}d ago`,
      isUrgent: true,
      isWarning: false,
      isExpired: true,
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft,
      label: lang === 'es' ? 'Expira hoy' : 'Expires today',
      isUrgent: true,
      isWarning: false,
      isExpired: false,
    };
  }

  const isUrgent = daysLeft <= 30;
  const isWarning = daysLeft > 30 && daysLeft <= 60;

  return {
    daysLeft,
    label: lang === 'es' ? `Expira en ${daysLeft}d` : `Expires in ${daysLeft}d`,
    isUrgent,
    isWarning,
    isExpired: false,
  };
}
