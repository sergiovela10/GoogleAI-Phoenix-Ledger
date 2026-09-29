import React from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatArea, getExpiryStatus } from '../utils/formatters';
import { statusColors, translations } from '../utils/translations';
import { Camera, FileText, UserCheck, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onSelect: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  lang,
  isDiscreet,
  onSelect,
}) => {
  const t = translations[lang];
  const expiry = getExpiryStatus(property.mandateExpiryDate, lang);
  const statusCfg = statusColors[property.status];
  const hasContact = Boolean(property.brokerContact?.name && property.brokerContact.name.trim() !== '');
  const hasPhoto = property.photos && property.photos.length > 0;

  const dealTypeLabel = property.dealType === 'Both' 
    ? t.sellAndRent 
    : property.dealType === 'Sell' 
      ? t.sell 
      : t.rent;

  const typeLabel = t[property.type.toLowerCase().replace('-', '') as keyof typeof t] || property.type;

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-[var(--surface)] border border-[var(--border-soft)] border-t-2 border-t-[var(--border)] hover:border-t-[var(--accent)] hover:border-[var(--accent)]/40 rounded p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-lg relative overflow-hidden"
    >
      <div>
        {/* Card Thumbnail */}
        <div className="-mx-5 -mt-5 mb-3.5 h-[138px] bg-[var(--bg)] border-b border-[var(--border-soft)] relative overflow-hidden flex items-center justify-center text-xs text-[var(--ink-faint)]">
          {hasPhoto ? (
            <img
              src={property.photos[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera className="w-5 h-5 opacity-40 text-[var(--ink-faint)]" />
              <span>{t.noPhotoYet}</span>
            </div>
          )}

          {/* District Tag Overlay */}
          <div className="absolute top-2.5 left-2.5 bg-[#12151A]/85 backdrop-blur-xs border border-white/10 px-2 py-0.5 rounded text-[10.5px] font-medium text-[var(--ink)]">
            {property.district}
          </div>

          {/* Quick Details indicator */}
          <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#12151A]/85 backdrop-blur-xs border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)]" />
          </div>
        </div>

        {/* Card Header (Parity with Draft) */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="min-w-0 pr-1">
            <h3 className="font-serif-fraunces text-[17px] font-medium leading-snug text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors truncate">
              {property.title}
            </h3>
            <p className="text-[12.5px] text-[var(--ink-dim)] mt-0.5 truncate">
              {typeLabel} · {dealTypeLabel}
            </p>
          </div>

          {/* Status Tag */}
          <span
            className="text-[11px] px-2.5 py-0.5 rounded font-medium whitespace-nowrap shrink-0 border"
            style={{
              backgroundColor: statusCfg.bg,
              color: statusCfg.text,
              borderColor: statusCfg.border,
            }}
          >
            {lang === 'es' ? (
              property.status === 'Available' ? 'Disponible' :
              property.status === 'In talks' ? 'En pláticas' :
              property.status === 'Under NCND' ? 'Bajo NCND' :
              property.status === 'Due Diligence' ? 'Due Diligence' :
              property.status === 'On Hold' ? 'En pausa' : 'Cerrado'
            ) : property.status}
          </span>
        </div>
      </div>

      <div>
        {/* Card Body: Price and Size (Parity with Draft) */}
        <div className="flex items-end justify-between mt-4">
          <div className="font-serif-fraunces text-xl font-medium text-[var(--ink)]">
            {formatCurrency(property.priceMxn, currency, isDiscreet)}
            {property.dealType === 'Rent' && (
              <span className="text-[11.5px] text-[var(--ink-dim)] font-sans-plex ml-1">/mes</span>
            )}
          </div>
          <div className="text-[13px] text-[var(--ink-dim)] text-right font-mono-plex">
            {formatArea(property.landAreaM2, isDiscreet)}
          </div>
        </div>

        {/* Card Foot (Parity with Draft) */}
        <div className="mt-3.5 pt-3.5 border-t border-[var(--border-soft)] flex items-center justify-between text-xs text-[var(--ink-faint)]">
          <span className="truncate pr-1">
            {hasContact ? t.contactOnFile : t.noContactOnFile} · {property.files.length} {property.files.length === 1 ? t.fileCount : t.filesCount}
          </span>

          <span
            className={`whitespace-nowrap shrink-0 font-medium ${
              expiry.isUrgent
                ? 'text-[var(--rust)]'
                : expiry.isWarning
                ? 'text-[#C17A2E]'
                : 'text-[var(--ink-faint)]'
            }`}
          >
            {expiry.label}
          </span>
        </div>
      </div>
    </div>
  );
};
