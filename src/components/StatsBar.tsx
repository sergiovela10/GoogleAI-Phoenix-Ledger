import React from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatNumber, convertFromMxn, getExpiryStatus } from '../utils/formatters';
import { translations } from '../utils/translations';
import { AlertCircle, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  properties: Property[];
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onFilterExpiring: () => void;
  isExpiringFiltered: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  properties,
  currency,
  lang,
  isDiscreet,
  onFilterExpiring,
  isExpiringFiltered,
}) => {
  const t = translations[lang];

  // Calculations
  const totalValueMxn = properties.reduce((acc, p) => acc + p.priceMxn, 0);
  const totalFootprintM2 = properties.reduce((acc, p) => acc + p.landAreaM2, 0);
  
  const sellCount = properties.filter(p => p.dealType === 'Sell').length;
  const rentCount = properties.filter(p => p.dealType === 'Rent').length;
  const bothCount = properties.filter(p => p.dealType === 'Both').length;

  const expiringList = properties.filter(p => {
    const status = getExpiryStatus(p.mandateExpiryDate, lang);
    return status.isUrgent;
  });
  const expiringCount = expiringList.length;

  // Secondary sub currency value
  const altCurrency: Currency = currency === 'USD' ? 'MXN' : 'USD';
  const altValueFormatted = isDiscreet 
    ? '••••••••' 
    : formatCurrency(totalValueMxn, altCurrency, false);

  const averagePricePerM2 = totalFootprintM2 > 0 ? totalValueMxn / totalFootprintM2 : 0;

  return (
    <div className="px-6 lg:px-10 py-4 border-b border-[var(--border-soft)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 bg-[var(--bg)]">
      {/* 1. Total Portfolio Value */}
      <div className="bg-[var(--surface)] border border-[var(--border-soft)] border-t-2 border-t-[var(--border)] rounded p-3.5 flex flex-col justify-between">
        <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between gap-1 mb-1">
          <span>{t.totalValue}</span>
          <span className="text-[10px] text-[var(--accent)] font-mono-plex tracking-wider uppercase">PORTFOLIO</span>
        </div>
        <div className="font-serif-fraunces text-xl lg:text-[22px] font-medium tracking-tight text-[var(--ink)] truncate">
          {formatCurrency(totalValueMxn, currency, isDiscreet)}
        </div>
        <div className="text-[11.5px] text-[var(--ink-faint)] mt-1 flex items-center justify-between">
          <span>~{altValueFormatted}</span>
          <span className="text-[10px] text-[var(--ink-faint)]">
            Avg: {formatCurrency(averagePricePerM2, currency, isDiscreet)}/m²
          </span>
        </div>
      </div>

      {/* 2. Registered Properties & Deals Split */}
      <div className="bg-[var(--surface)] border border-[var(--border-soft)] border-t-2 border-t-[var(--border)] rounded p-3.5 flex flex-col justify-between">
        <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between gap-1 mb-1">
          <span>{t.properties}</span>
          <span className="text-[10px] text-[var(--ink-faint)]">ACTIVE</span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="font-serif-fraunces text-xl lg:text-[22px] font-medium text-[var(--ink)]">
            {properties.length}
          </div>
          <span className="text-[11.5px] text-[var(--ink-dim)] font-sans-plex">
            {lang === 'es' ? 'expedientes' : 'records'}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="flex-1 text-center bg-[var(--surface-2)] border border-[var(--border-soft)] rounded py-1 px-1">
            <div className="font-serif-fraunces text-xs font-semibold text-[var(--ink)]">{sellCount}</div>
            <div className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider">{t.sell}</div>
          </div>
          <div className="flex-1 text-center bg-[var(--surface-2)] border border-[var(--border-soft)] rounded py-1 px-1">
            <div className="font-serif-fraunces text-xs font-semibold text-[var(--ink)]">{rentCount}</div>
            <div className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider">{t.rent}</div>
          </div>
          <div className="flex-1 text-center bg-[var(--surface-2)] border border-[var(--border-soft)] rounded py-1 px-1">
            <div className="font-serif-fraunces text-xs font-semibold text-[var(--ink)]">{bothCount}</div>
            <div className="text-[9px] text-[var(--ink-faint)] uppercase tracking-wider">{t.both}</div>
          </div>
        </div>
      </div>

      {/* 3. Total Footprint */}
      <div className="bg-[var(--surface)] border border-[var(--border-soft)] border-t-2 border-t-[var(--border)] rounded p-3.5 flex flex-col justify-between">
        <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between gap-1 mb-1">
          <span>{t.totalFootprint}</span>
          <span className="text-[10px] text-[var(--ink-faint)]">LAND & BUILT</span>
        </div>
        <div className="font-serif-fraunces text-xl lg:text-[22px] font-medium tracking-tight text-[var(--ink)] truncate">
          {formatNumber(totalFootprintM2, isDiscreet)}
          <span className="text-xs text-[var(--ink-dim)] font-sans-plex ml-1.5">m²</span>
        </div>
        <div className="text-[11.5px] text-[var(--ink-faint)] mt-1 flex items-center justify-between">
          <span>{t.acrossProperties}</span>
          <span className="text-[10.5px] text-[var(--ink-dim)] font-mono-plex">
            ~{isDiscreet ? '•••' : (totalFootprintM2 / 10000).toFixed(1)} Ha
          </span>
        </div>
      </div>

      {/* 4. Expiring Soon (Clickable Filter Card) */}
      <div 
        onClick={onFilterExpiring}
        className={`bg-[var(--surface)] border border-t-2 rounded p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
          isExpiringFiltered 
            ? 'border-[var(--rust)] ring-1 ring-[var(--rust)]/40 bg-[var(--rust)]/10' 
            : 'border-[var(--border-soft)] border-t-[var(--rust)] hover:border-[var(--rust)]/60'
        }`}
        title="Click to toggle filter for urgent expiring agreements"
      >
        <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between gap-1 mb-1">
          <span className="flex items-center gap-1.5 text-[var(--rust)] font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {t.expiringSoon}
          </span>
          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono-plex ${
            isExpiringFiltered ? 'bg-[var(--rust)] text-white' : 'bg-[var(--surface-2)] text-[var(--rust)]'
          }`}>
            {isExpiringFiltered ? 'FILTERED' : 'ALERT'}
          </span>
        </div>
        <div className="font-serif-fraunces text-xl lg:text-[22px] font-medium tracking-tight text-[var(--rust)]">
          {expiringCount}
        </div>
        <div className="text-[11.5px] text-[var(--ink-faint)] mt-1 flex items-center justify-between">
          <span>{t.expiringWithin30}</span>
          <span className="text-[10px] text-[var(--rust)] underline">
            {isExpiringFiltered ? 'Show All' : 'Filter Now'}
          </span>
        </div>
      </div>
    </div>
  );
};
