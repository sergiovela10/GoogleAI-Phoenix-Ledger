import React from 'react';
import { Property, PropertyStatus, Currency, Language } from '../types';
import { formatCurrency, getExpiryStatus } from '../utils/formatters';
import { statusColors, translations } from '../utils/translations';
import { ChevronLeft, ChevronRight, AlertCircle, FileText } from 'lucide-react';

interface PropertyPipelineViewProps {
  properties: Property[];
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onSelect: (property: Property) => void;
  onUpdateStatus: (propertyId: string, nextStatus: PropertyStatus) => void;
}

const STAGES: PropertyStatus[] = [
  'Available',
  'In talks',
  'Under NCND',
  'Due Diligence',
  'On Hold',
  'Closed',
];

export const PropertyPipelineView: React.FC<PropertyPipelineViewProps> = ({
  properties,
  currency,
  lang,
  isDiscreet,
  onSelect,
  onUpdateStatus,
}) => {
  const t = translations[lang];

  return (
    <div className="px-6 lg:px-10 py-4 overflow-x-auto">
      <div className="flex gap-4 min-w-[1100px] pb-4">
        {STAGES.map((stage, idx) => {
          const stageProps = properties.filter((p) => p.status === stage);
          const totalVal = stageProps.reduce((sum, p) => sum + p.priceMxn, 0);
          const cfg = statusColors[stage];

          const stageLabel = lang === 'es' ? (
            stage === 'Available' ? 'Disponibles' :
            stage === 'In talks' ? 'En pláticas' :
            stage === 'Under NCND' ? 'Bajo NCND' :
            stage === 'Due Diligence' ? 'Due Diligence' :
            stage === 'On Hold' ? 'En pausa' : 'Cerrados'
          ) : stage;

          return (
            <div
              key={stage}
              className="flex-1 min-w-[220px] bg-[var(--surface)] border border-[var(--border)] rounded flex flex-col max-h-[calc(100vh-250px)]"
            >
              {/* Column Header */}
              <div 
                className="p-3 border-b border-[var(--border)] bg-[var(--surface-2)] flex flex-col gap-1"
                style={{ borderTop: `3px solid ${cfg.raw}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[var(--ink)]">
                    {stageLabel}
                  </span>
                  <span className="text-[11px] font-mono-plex bg-[var(--surface)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--ink-dim)]">
                    {stageProps.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono-plex text-[var(--ink-dim)]">
                  {formatCurrency(totalVal, currency, isDiscreet)}
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 overflow-y-auto flex flex-col gap-2.5 flex-1">
                {stageProps.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--ink-faint)] italic">
                    {lang === 'es' ? 'Sin expedientes en esta etapa' : 'No records in this stage'}
                  </div>
                ) : (
                  stageProps.map((prop) => {
                    const expiry = getExpiryStatus(prop.mandateExpiryDate, lang);

                    return (
                      <div
                        key={prop.id}
                        onClick={() => onSelect(prop)}
                        className="bg-[var(--surface-2)] border border-[var(--border-soft)] hover:border-[var(--accent)] p-3 rounded cursor-pointer transition-all duration-150 flex flex-col gap-2 shadow-xs group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <h4 className="font-serif-fraunces text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-1">
                              {prop.title}
                            </h4>
                            <div className="text-[11px] text-[var(--ink-dim)] mt-0.5">
                              {prop.district} · {prop.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between pt-1">
                          <span className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
                            {formatCurrency(prop.priceMxn, currency, isDiscreet)}
                          </span>
                          <span className="text-[11px] text-[var(--ink-dim)] font-mono-plex">
                            {prop.dealType}
                          </span>
                        </div>

                        {/* Expiry and file tags */}
                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10.5px]">
                          <span
                            className={`font-mono-plex font-medium ${
                              expiry.isUrgent ? 'text-[var(--rust)]' : 'text-[var(--ink-faint)]'
                            }`}
                          >
                            {expiry.label}
                          </span>

                          <span className="text-[var(--ink-faint)]">
                            {prop.files.length} {t.filesCount}
                          </span>
                        </div>

                        {/* Stage Shift Controls */}
                        <div 
                          className="flex items-center justify-between pt-2 border-t border-[var(--border-soft)] text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            disabled={idx === 0}
                            onClick={() => onUpdateStatus(prop.id, STAGES[idx - 1])}
                            className="p-1 rounded bg-[var(--surface)] text-[var(--ink-dim)] hover:text-[var(--ink)] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move to previous stage"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>

                          <span className="text-[10px] text-[var(--ink-faint)] uppercase tracking-wider">
                            Move Stage
                          </span>

                          <button
                            disabled={idx === STAGES.length - 1}
                            onClick={() => onUpdateStatus(prop.id, STAGES[idx + 1])}
                            className="p-1 rounded bg-[var(--surface)] text-[var(--ink-dim)] hover:text-[var(--ink)] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move to next stage"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
