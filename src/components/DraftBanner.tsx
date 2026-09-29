import React from 'react';
import { translations } from '../utils/translations';
import { Language } from '../types';
import { Shield, Clock, Lock } from 'lucide-react';

interface DraftBannerProps {
  lang: Language;
  expiringCount: number;
  isDiscreet: boolean;
  onFilterExpiring: () => void;
}

export const DraftBanner: React.FC<DraftBannerProps> = ({
  lang,
  expiringCount,
  isDiscreet,
  onFilterExpiring,
}) => {
  const t = translations[lang];

  return (
    <div className="bg-[var(--accent-soft)] text-[var(--accent)] text-xs px-6 lg:px-10 py-2 border-b border-[var(--border-soft)] flex flex-wrap items-center justify-between gap-3 transition-colors">
      <div className="flex items-center gap-2.5 font-medium">
        <span className="flex items-center gap-1.5 font-semibold tracking-wide uppercase text-[11px] text-[var(--ink)]">
          <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
          Phoenix Ledger v2.4
        </span>
        <span className="text-[var(--ink-faint)]">·</span>
        <span className="text-[var(--ink-dim)]">{t.draftBanner}</span>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        {expiringCount > 0 && (
          <button
            onClick={onFilterExpiring}
            className="flex items-center gap-1.5 text-[var(--rust)] hover:underline font-medium cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {expiringCount} {lang === 'es' ? 'mandatos vencen en ≤30 días' : 'mandates expiring in ≤30 days'}
            </span>
          </button>
        )}
        <div className="flex items-center gap-1 text-[var(--ink-dim)]">
          <Lock className="w-3 h-3 text-[var(--accent)]" />
          <span>{isDiscreet ? (lang === 'es' ? 'Modo Discreto Activo' : 'Discreet Shield Active') : (lang === 'es' ? 'Cifrado Local' : 'Local Encryption')}</span>
        </div>
      </div>
    </div>
  );
};
