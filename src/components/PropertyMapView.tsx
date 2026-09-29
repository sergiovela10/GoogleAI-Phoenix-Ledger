import React, { useState } from 'react';
import { Property, Currency, Language } from '../types';
import { formatCurrency, formatArea } from '../utils/formatters';
import { statusColors, translations } from '../utils/translations';
import { MapPin, Navigation, Building2, ExternalLink, Compass } from 'lucide-react';

interface PropertyMapViewProps {
  properties: Property[];
  currency: Currency;
  lang: Language;
  isDiscreet: boolean;
  onSelect: (property: Property) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  currency,
  lang,
  isDiscreet,
  onSelect,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const t = translations[lang];

  const districts = ['All', 'San Pedro Garza García', 'Santa Catarina', 'Carretera Nacional', 'Monterrey Centro', 'Apodaca'];

  const filtered = selectedDistrict === 'All' 
    ? properties 
    : properties.filter(p => p.district === selectedDistrict);

  // Geographic bounds approximation for Monterrey Metropolitan Area
  // Lat: ~25.55 to 25.80, Lng: -100.50 to -100.15
  const minLat = 25.54, maxLat = 25.80;
  const minLng = -100.52, maxLng = -100.15;

  const getCoordinatesPct = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div className="px-6 lg:px-10 py-4 flex flex-col gap-4">
      {/* District Pill Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-[var(--ink-dim)] flex items-center gap-1 shrink-0 font-medium">
          <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
          {lang === 'es' ? 'Zonas Metropolitanas:' : 'Metropolitan Sectors:'}
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {districts.map((d) => {
            const count = d === 'All' ? properties.length : properties.filter(p => p.district === d).length;
            return (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedDistrict === d
                    ? 'bg-[var(--accent)] text-[#14171C] border-[var(--accent)] font-semibold'
                    : 'bg-[var(--surface)] text-[var(--ink-dim)] border-[var(--border)] hover:text-[var(--ink)]'
                }`}
              >
                {d === 'All' ? (lang === 'es' ? 'Todas las zonas' : 'All Sectors') : d}
                <span className="ml-1.5 opacity-75 font-mono-plex text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas and District Summary split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interactive Vector Topographic Map Container */}
        <div className="lg:col-span-2 relative min-h-[460px] bg-[#0E1116] border border-[var(--border)] rounded overflow-hidden flex flex-col justify-between p-4">
          {/* Subtle Grid and Contour Lines */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#C17A2E 1px, transparent 1px), linear-gradient(to right, #2A2F39 1px, transparent 1px)',
              backgroundSize: '32px 32px, 64px 64px'
            }}
          />

          {/* Mountains Silhouette styling (Sierra Madre & Cerro de la Silla contours) */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 800 500">
            <path d="M 0 350 Q 200 200 400 290 T 800 240 L 800 500 L 0 500 Z" fill="#20242D" />
            <path d="M 120 400 Q 300 280 500 340 T 800 380 L 800 500 L 120 500 Z" fill="#1A1E25" />
            {/* Sierra Madre ridgeline */}
            <path d="M 50 380 L 220 230 L 320 280 L 460 210 L 600 310 L 750 250" fill="none" stroke="#C17A2E" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Map Top Bar */}
          <div className="relative z-10 flex items-center justify-between bg-[var(--surface)]/90 backdrop-blur-xs border border-[var(--border)] px-3 py-1.5 rounded text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--sage)] animate-pulse" />
              <span className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
                Monterrey Metropolitan Zone
              </span>
              <span className="text-[11px] text-[var(--ink-faint)]">25.6866° N, 100.3161° W</span>
            </div>
            <span className="text-[11px] font-mono-plex text-[var(--ink-dim)]">
              {filtered.length} {lang === 'es' ? 'ubicaciones' : 'locations'}
            </span>
          </div>

          {/* Interactive Pins */}
          <div className="relative w-full h-[360px] my-auto">
            {filtered.map((prop) => {
              const { x, y } = getCoordinatesPct(prop.coordinates.lat, prop.coordinates.lng);
              const isHovered = hoveredProperty?.id === prop.id;
              const statusCfg = statusColors[prop.status];

              return (
                <div
                  key={prop.id}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onMouseEnter={() => setHoveredProperty(prop)}
                  onClick={() => onSelect(prop)}
                >
                  <div className="relative group">
                    {/* Pulsing ring */}
                    <div 
                      className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition-transform group-hover:scale-125"
                      style={{ backgroundColor: statusCfg.raw }}
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>

                    {/* Pin Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-8 bg-[var(--surface-2)]/95 backdrop-blur-xs border border-[var(--border)] rounded px-2 py-0.5 text-[10px] font-medium text-[var(--ink)] whitespace-nowrap shadow-md opacity-80 group-hover:opacity-100 group-hover:z-30 pointer-events-none">
                      {prop.title}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hovered Property Callout Box */}
            {hoveredProperty && (
              <div 
                className="absolute bottom-2 left-2 right-2 sm:right-auto sm:w-80 bg-[var(--surface)] border border-[var(--accent)]/50 rounded p-3 z-30 shadow-2xl flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
                      {hoveredProperty.title}
                    </h5>
                    <div className="text-[11px] text-[var(--ink-dim)]">
                      {hoveredProperty.district} · {hoveredProperty.type}
                    </div>
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded border"
                    style={{
                      backgroundColor: statusColors[hoveredProperty.status].bg,
                      color: statusColors[hoveredProperty.status].text,
                      borderColor: statusColors[hoveredProperty.status].border,
                    }}
                  >
                    {hoveredProperty.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-soft)]">
                  <span className="font-serif-fraunces text-sm font-medium text-[var(--ink)]">
                    {formatCurrency(hoveredProperty.priceMxn, currency, isDiscreet)}
                  </span>
                  <button
                    onClick={() => onSelect(hoveredProperty)}
                    className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>{t.propertyDetails}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map Compass and Scale legend */}
          <div className="relative z-10 flex items-center justify-between text-[10.5px] text-[var(--ink-faint)]">
            <span>Santa Catarina ⟵ West | East ⟶ Apodaca</span>
            <span>Elevation: 540m - 1,200m ASL</span>
          </div>
        </div>

        {/* District Intelligence & Property List */}
        <div className="flex flex-col gap-3">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex flex-col gap-3">
            <h4 className="font-serif-fraunces text-sm font-medium text-[var(--ink)] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--accent)]" />
              {selectedDistrict === 'All' ? 'Metropolitan Portfolio' : selectedDistrict}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[var(--surface-2)] p-2.5 rounded border border-[var(--border-soft)]">
                <div className="text-[10px] text-[var(--ink-dim)] uppercase">Total Value</div>
                <div className="font-serif-fraunces text-sm font-medium text-[var(--ink)] mt-0.5">
                  {formatCurrency(filtered.reduce((s, p) => s + p.priceMxn, 0), currency, isDiscreet)}
                </div>
              </div>

              <div className="bg-[var(--surface-2)] p-2.5 rounded border border-[var(--border-soft)]">
                <div className="text-[10px] text-[var(--ink-dim)] uppercase">Land Footprint</div>
                <div className="font-serif-fraunces text-sm font-medium text-[var(--ink)] mt-0.5">
                  {formatArea(filtered.reduce((s, p) => s + p.landAreaM2, 0), isDiscreet)}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[var(--ink-dim)] leading-relaxed">
              {selectedDistrict === 'San Pedro Garza García'
                ? 'Highest average residential and corporate values in Latin America. Prime high-barrier-to-entry luxury enclave.'
                : selectedDistrict === 'Santa Catarina'
                ? 'High-growth industrial and logistics hub with major nearshoring investments and highway connectivity.'
                : selectedDistrict === 'Carretera Nacional'
                ? 'Expansive natural land parcels and exclusive residential estates along the southern mountain ridge.'
                : 'Strategic property records situated across high-yield metropolitan corridors.'}
            </div>
          </div>

          {/* Quick List for this zone */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-3 flex flex-col gap-2 max-h-[260px] overflow-y-auto">
            <div className="text-[11px] text-[var(--ink-dim)] font-medium uppercase tracking-wider px-1">
              Properties in this View ({filtered.length})
            </div>
            {filtered.map((prop) => (
              <div
                key={prop.id}
                onClick={() => onSelect(prop)}
                className="p-2 rounded bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 border border-[var(--border-soft)] hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-medium text-[var(--ink)] truncate">{prop.title}</div>
                  <div className="text-[10.5px] text-[var(--ink-dim)]">{prop.type} · {prop.district}</div>
                </div>
                <div className="font-mono-plex text-right shrink-0 font-medium text-[var(--ink)]">
                  {formatCurrency(prop.priceMxn, currency, isDiscreet)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
