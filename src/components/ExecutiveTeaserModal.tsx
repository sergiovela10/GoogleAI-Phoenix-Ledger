import React from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatArea } from '../utils/formatters';
import { translations } from '../utils/translations';
import { Printer, X, Shield, MapPin, Building, Calendar, CheckSquare } from 'lucide-react';

interface ExecutiveTeaserModalProps {
  property: Property;
  onClose: () => void;
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
}

export const ExecutiveTeaserModal: React.FC<ExecutiveTeaserModalProps> = ({
  property,
  onClose,
  currency,
  lang,
  isDiscreet,
}) => {
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs">
      <div 
        className="bg-[#14171E] border border-[var(--border)] rounded-lg w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Bar */}
        <div className="no-print px-6 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 text-xs text-[var(--accent)] font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Executive Teaser · Confidential Investment Brief</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded text-xs bg-[var(--accent)] text-[#14171C] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[var(--ink-dim)] hover:text-[var(--ink)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Executive Document Canvas */}
        <div className="overflow-y-auto flex-1 p-8 sm:p-10 flex flex-col gap-6 bg-[#161A22] text-[#EDEAE2]">
          {/* Document Header Lockup */}
          <div className="border-b border-[var(--border)] pb-6 flex items-start justify-between">
            <div>
              <div className="font-serif-fraunces text-2xl font-medium tracking-wide">
                Phoenix <span style={{ color: 'var(--accent)' }}>Ledger</span>
              </div>
              <div className="text-[11px] text-[var(--ink-dim)] uppercase tracking-wider mt-1">
                Private Office Property Portfolio · Monterrey, NL
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono-plex tracking-widest px-2.5 py-1 rounded bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/40">
                CONFIDENTIAL DOSSIER
              </span>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-1.5 font-mono-plex">
                REF: {property.id.toUpperCase()} · {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Title & Coordinates */}
          <div>
            <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-semibold">
              {property.district} · {property.type}
            </span>
            <h1 className="font-serif-fraunces text-2xl sm:text-3xl font-medium mt-1 text-white">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[var(--ink-dim)] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Key Metrics Executive Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded bg-[#1C212B] border border-[var(--border)]">
            <div>
              <div className="text-[10px] uppercase text-[var(--ink-dim)] tracking-wider">Asking Price</div>
              <div className="font-serif-fraunces text-xl font-medium text-white mt-1">
                {formatCurrency(property.priceMxn, currency, isDiscreet)}
              </div>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-0.5">
                {property.dealType}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase text-[var(--ink-dim)] tracking-wider">Land Footprint</div>
              <div className="font-serif-fraunces text-xl font-medium text-white mt-1">
                {formatArea(property.landAreaM2, isDiscreet)}
              </div>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-0.5">
                {(property.landAreaM2 / 10000).toFixed(2)} Hectares
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase text-[var(--ink-dim)] tracking-wider">Construction</div>
              <div className="font-serif-fraunces text-xl font-medium text-white mt-1">
                {property.builtAreaM2 ? formatArea(property.builtAreaM2, isDiscreet) : 'Vacant Land'}
              </div>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-0.5">
                {property.builtAreaM2 ? 'Enclosed built' : '100% Raw terrain'}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase text-[var(--ink-dim)] tracking-wider">Zoning Classification</div>
              <div className="font-serif-fraunces text-sm font-medium text-[var(--accent)] mt-1">
                {property.zoning}
              </div>
              <div className="text-[10.5px] text-[var(--ink-faint)] mt-0.5">
                Cadastral Certified
              </div>
            </div>
          </div>

          {/* Hero Architectural Visual */}
          {property.photos && property.photos.length > 0 && (
            <div className="w-full h-64 rounded overflow-hidden border border-[var(--border)]">
              <img
                src={property.photos[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Executive Narrative */}
          <div className="flex flex-col gap-2">
            <h3 className="font-serif-fraunces text-base font-medium text-white">
              Investment Thesis & Technical Overview
            </h3>
            <p className="text-xs leading-relaxed text-[var(--ink-dim)] whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Confidentiality Notice & Signature Footer */}
          <div className="border-t border-[var(--border)] pt-4 mt-auto flex flex-col sm:flex-row items-center justify-between text-[10.5px] text-[var(--ink-faint)] gap-2">
            <div>
              Confidential document subject to NCND & bilateral brokerage agreements.
            </div>
            <div className="font-mono-plex">
              Phoenix Ledger Proprietary Records · Monterrey, Mexico
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
