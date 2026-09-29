import React from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatArea, getExpiryStatus } from '../utils/formatters';
import { statusColors, translations } from '../utils/translations';
import { MessageSquare, ExternalLink, ArrowRight, Shield } from 'lucide-react';

interface PropertyTableViewProps {
  properties: Property[];
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onSelect: (property: Property) => void;
}

export const PropertyTableView: React.FC<PropertyTableViewProps> = ({
  properties,
  currency,
  lang,
  isDiscreet,
  onSelect,
}) => {
  const t = translations[lang];

  return (
    <div className="px-6 lg:px-10 py-4">
      <div className="overflow-x-auto border border-[var(--border)] rounded bg-[var(--surface)]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--ink-dim)] uppercase tracking-wider text-[10.5px]">
              <th className="py-3 px-4 font-semibold">Asset / Title</th>
              <th className="py-3 px-4 font-semibold">District</th>
              <th className="py-3 px-4 font-semibold">Type & Deal</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Price ({currency})</th>
              <th className="py-3 px-4 font-semibold text-right">Land Area</th>
              <th className="py-3 px-4 font-semibold text-right">Price/m²</th>
              <th className="py-3 px-4 font-semibold">Mandate Expiry</th>
              <th className="py-3 px-4 font-semibold">Contact</th>
              <th className="py-3 px-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {properties.map((prop) => {
              const expiry = getExpiryStatus(prop.mandateExpiryDate, lang);
              const statusCfg = statusColors[prop.status];
              const pricePerM2 = prop.landAreaM2 > 0 ? prop.priceMxn / prop.landAreaM2 : 0;
              const hasContact = Boolean(prop.brokerContact?.name && prop.brokerContact.name.trim() !== '');

              return (
                <tr
                  key={prop.id}
                  onClick={() => onSelect(prop)}
                  className="hover:bg-[var(--surface-2)]/70 transition-colors cursor-pointer group"
                >
                  {/* Asset Title */}
                  <td className="py-3 px-4">
                    <div className="font-serif-fraunces text-sm font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                      {prop.title}
                    </div>
                    <div className="text-[11px] text-[var(--ink-faint)] truncate max-w-xs">
                      {prop.address}
                    </div>
                  </td>

                  {/* District */}
                  <td className="py-3 px-4 text-[var(--ink-dim)] whitespace-nowrap">
                    {prop.district}
                  </td>

                  {/* Type & Deal */}
                  <td className="py-3 px-4 text-[var(--ink-dim)] whitespace-nowrap">
                    <span className="font-medium text-[var(--ink)]">{prop.type}</span>
                    <span className="text-[var(--ink-faint)] mx-1">·</span>
                    <span>{prop.dealType}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className="px-2 py-0.5 rounded text-[10.5px] font-medium border"
                      style={{
                        backgroundColor: statusCfg.bg,
                        color: statusCfg.text,
                        borderColor: statusCfg.border,
                      }}
                    >
                      {prop.status}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right font-mono-plex text-[var(--ink)] font-medium whitespace-nowrap">
                    {formatCurrency(prop.priceMxn, currency, isDiscreet)}
                  </td>

                  {/* Land Area */}
                  <td className="py-3 px-4 text-right font-mono-plex text-[var(--ink-dim)] whitespace-nowrap">
                    {formatArea(prop.landAreaM2, isDiscreet)}
                  </td>

                  {/* Price/m2 */}
                  <td className="py-3 px-4 text-right font-mono-plex text-[var(--ink-dim)] whitespace-nowrap">
                    {formatCurrency(pricePerM2, currency, isDiscreet)}
                  </td>

                  {/* Mandate Expiry */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono-plex font-medium ${
                        expiry.isUrgent
                          ? 'text-[var(--rust)]'
                          : expiry.isWarning
                          ? 'text-[#C17A2E]'
                          : 'text-[var(--ink-faint)]'
                      }`}
                    >
                      {expiry.label}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-[var(--ink-dim)] whitespace-nowrap">
                    {hasContact ? (
                      <div>
                        <div className="text-[var(--ink)] font-medium truncate max-w-[140px]">
                          {isDiscreet ? '••••••••' : prop.brokerContact.name}
                        </div>
                        <div className="text-[10.5px] text-[var(--ink-faint)] truncate max-w-[140px]">
                          {prop.brokerContact.agency || (prop.brokerContact.isOwnerDirect ? 'Owner Direct' : '')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[var(--ink-faint)] italic">{t.noContactOnFile}</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(prop);
                      }}
                      className="p-1 rounded bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--ink-dim)] hover:text-[var(--accent)] inline-flex items-center justify-center transition-colors cursor-pointer"
                      title="Open Dossier"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
