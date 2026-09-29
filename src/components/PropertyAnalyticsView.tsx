import React from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatArea, getExpiryStatus } from '../utils/formatters';
import { translations, statusColors } from '../utils/translations';
import { PieChart, TrendingUp, DollarSign, Calendar, ShieldCheck, Percent } from 'lucide-react';

interface PropertyAnalyticsViewProps {
  properties: Property[];
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
}

export const PropertyAnalyticsView: React.FC<PropertyAnalyticsViewProps> = ({
  properties,
  currency,
  lang,
  isDiscreet,
}) => {
  const t = translations[lang];

  const totalValueMxn = properties.reduce((acc, p) => acc + p.priceMxn, 0);
  const totalAreaM2 = properties.reduce((acc, p) => acc + p.landAreaM2, 0);
  const totalCommissionPotentialMxn = properties.reduce((acc, p) => acc + (p.priceMxn * (p.commissionPct / 100)), 0);

  // Group by Property Type
  const byType: Record<string, { count: number; value: number; area: number }> = {};
  properties.forEach(p => {
    if (!byType[p.type]) byType[p.type] = { count: 0, value: 0, area: 0 };
    byType[p.type].count += 1;
    byType[p.type].value += p.priceMxn;
    byType[p.type].area += p.landAreaM2;
  });

  // Group by District
  const byDistrict: Record<string, { count: number; value: number }> = {};
  properties.forEach(p => {
    if (!byDistrict[p.district]) byDistrict[p.district] = { count: 0, value: 0 };
    byDistrict[p.district].count += 1;
    byDistrict[p.district].value += p.priceMxn;
  });

  // Expiry risk breakdown
  let expiring30 = 0, expiring60 = 0, expiringLong = 0, noExpiry = 0;
  properties.forEach(p => {
    const exp = getExpiryStatus(p.mandateExpiryDate, lang);
    if (exp.daysLeft === null) noExpiry++;
    else if (exp.daysLeft <= 30) expiring30++;
    else if (exp.daysLeft <= 60) expiring60++;
    else expiringLong++;
  });

  return (
    <div className="px-6 lg:px-10 py-4 flex flex-col gap-5">
      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col justify-between">
          <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between">
            <span>{lang === 'es' ? 'Comisión Potencial Agregada' : 'Aggregate Brokerage Commission'}</span>
            <Percent className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="font-serif-fraunces text-2xl font-medium text-[var(--ink)] mt-2">
            {formatCurrency(totalCommissionPotentialMxn, currency, isDiscreet)}
          </div>
          <div className="text-[11px] text-[var(--ink-faint)] mt-1">
            {lang === 'es' ? 'Basado en mandatos exclusivos (~4.5% promedio)' : 'Based on exclusive mandates (~4.5% avg)'}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col justify-between">
          <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between">
            <span>{lang === 'es' ? 'Precio Promedio por m² (Global)' : 'Weighted Price per m²'}</span>
            <DollarSign className="w-4 h-4 text-[var(--sage)]" />
          </div>
          <div className="font-serif-fraunces text-2xl font-medium text-[var(--ink)] mt-2">
            {formatCurrency(totalAreaM2 > 0 ? totalValueMxn / totalAreaM2 : 0, currency, isDiscreet)}
            <span className="text-xs text-[var(--ink-dim)] font-sans-plex ml-1">/m²</span>
          </div>
          <div className="text-[11px] text-[var(--ink-faint)] mt-1">
            {lang === 'es' ? 'Combinación de suelo campestre, industrial y residencial' : 'Blended raw land, logistics, and luxury residential'}
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col justify-between">
          <div className="text-[11.5px] text-[var(--ink-dim)] flex items-center justify-between">
            <span>{lang === 'es' ? 'Salud del Inventario de Mandatos' : 'Mandate Expiry Health'}</span>
            <Calendar className="w-4 h-4 text-[var(--rust)]" />
          </div>
          <div className="font-serif-fraunces text-2xl font-medium text-[var(--ink)] mt-2 flex items-baseline gap-2">
            <span>{properties.length - expiring30}/{properties.length}</span>
            <span className="text-xs font-sans-plex text-[var(--sage)] font-normal">
              {Math.round(((properties.length - expiring30) / properties.length) * 100)}% Stable
            </span>
          </div>
          <div className="text-[11px] text-[var(--rust)] mt-1">
            {expiring30} {lang === 'es' ? 'requieren renovación inmediata' : 'require immediate renewal'}
          </div>
        </div>
      </div>

      {/* Grid: By Asset Class & By District */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Breakdown by Property Type */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
            <h4 className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
              {lang === 'es' ? 'Distribución por Clase de Activo' : 'Allocation by Asset Class'}
            </h4>
            <span className="text-[11px] text-[var(--ink-dim)]">{Object.keys(byType).length} categories</span>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            {Object.entries(byType).map(([type, data]) => {
              const pct = totalValueMxn > 0 ? (data.value / totalValueMxn) * 100 : 0;
              return (
                <div key={type} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--ink)]">
                      {type} ({data.count})
                    </span>
                    <div className="flex items-center gap-2 font-mono-plex">
                      <span className="text-[var(--ink)]">{formatCurrency(data.value, currency, isDiscreet)}</span>
                      <span className="text-[var(--ink-dim)] text-[10.5px]">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by District */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
            <h4 className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
              {lang === 'es' ? 'Concentración Geográfica por Municipio' : 'Geographic Concentration'}
            </h4>
            <span className="text-[11px] text-[var(--ink-dim)]">{Object.keys(byDistrict).length} districts</span>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            {Object.entries(byDistrict).map(([dist, data]) => {
              const pct = totalValueMxn > 0 ? (data.value / totalValueMxn) * 100 : 0;
              return (
                <div key={dist} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--ink)]">
                      {dist} ({data.count})
                    </span>
                    <div className="flex items-center gap-2 font-mono-plex">
                      <span className="text-[var(--ink)]">{formatCurrency(data.value, currency, isDiscreet)}</span>
                      <span className="text-[var(--ink-dim)] text-[10.5px]">({pct.toFixed(1)}%)</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--sage)] rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
