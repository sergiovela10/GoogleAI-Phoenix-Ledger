import React from 'react';
import { DealType, PropertyType, PropertyStatus, Language } from '../types';
import { translations } from '../utils/translations';
import { Search, ArrowUpDown, X, Filter } from 'lucide-react';

interface ControlsBarProps {
  dealFilter: DealType | 'All';
  onDealFilterChange: (filter: DealType | 'All') => void;
  typeFilter: PropertyType | 'All';
  onTypeFilterChange: (filter: PropertyType | 'All') => void;
  statusFilter: PropertyStatus | 'All';
  onStatusFilterChange: (filter: PropertyStatus | 'All') => void;
  sortField: 'date' | 'price' | 'size' | 'expiry';
  onSortFieldChange: (field: 'date' | 'price' | 'size' | 'expiry') => void;
  sortAscending: boolean;
  onToggleSortDirection: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  lang: Language;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  dealFilter,
  onDealFilterChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortField,
  onSortFieldChange,
  sortAscending,
  onToggleSortDirection,
  searchQuery,
  onSearchQueryChange,
  lang,
  onResetFilters,
  isFiltered,
}) => {
  const t = translations[lang];

  const dealOptions: { value: DealType | 'All'; label: string }[] = [
    { value: 'All', label: t.allDeals },
    { value: 'Sell', label: t.sell },
    { value: 'Rent', label: t.rent },
    { value: 'Both', label: t.sellAndRent },
  ];

  const typeOptions: { value: PropertyType | 'All'; label: string }[] = [
    { value: 'All', label: t.allTypes },
    { value: 'House', label: t.house },
    { value: 'Land', label: t.land },
    { value: 'Commercial', label: t.commercial },
    { value: 'Industrial', label: t.industrial },
    { value: 'Mixed-use', label: t.mixedUse },
    { value: 'Office', label: t.office },
  ];

  const statusOptions: { value: PropertyStatus | 'All'; label: string }[] = [
    { value: 'All', label: t.statusAll },
    { value: 'Available', label: t.available },
    { value: 'In talks', label: t.inTalks },
    { value: 'Under NCND', label: t.underNcnd },
    { value: 'Due Diligence', label: t.dueDiligence },
    { value: 'On Hold', label: t.onHold },
    { value: 'Closed', label: t.closed },
  ];

  return (
    <div className="px-6 lg:px-10 pt-5 pb-3 flex flex-col gap-3 bg-[var(--bg)]">
      {/* Search and Secondary Selectors Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-dim)] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--accent)] text-[var(--ink)] placeholder-[var(--ink-faint)] text-xs rounded-full pl-9 pr-8 py-2 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-dim)] hover:text-[var(--ink)] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown and Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs text-[var(--ink)]">
            <Filter className="w-3 h-3 text-[var(--ink-dim)]" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as PropertyStatus | 'All')}
              className="bg-transparent border-none text-[var(--ink)] text-xs outline-none cursor-pointer pr-1"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[var(--surface-2)] text-[var(--ink)]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1.5 text-xs text-[var(--ink)]">
            <span className="text-[var(--ink-dim)] text-[11px]">{t.sortBy}:</span>
            <select
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value as any)}
              className="bg-transparent border-none text-[var(--ink)] text-xs outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="date" className="bg-[var(--surface-2)] text-[var(--ink)]">{t.recentlyAdded}</option>
              <option value="price" className="bg-[var(--surface-2)] text-[var(--ink)]">{lang === 'es' ? 'Precio' : 'Price'}</option>
              <option value="size" className="bg-[var(--surface-2)] text-[var(--ink)]">{lang === 'es' ? 'Superficie' : 'Size'}</option>
              <option value="expiry" className="bg-[var(--surface-2)] text-[var(--ink)]">{t.mandateExpiry}</option>
            </select>
          </div>

          {/* Sort Direction Toggle */}
          <button
            onClick={onToggleSortDirection}
            className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink-faint)] text-[var(--ink-dim)] hover:text-[var(--ink)] flex items-center justify-center transition-colors cursor-pointer"
            title={sortAscending ? 'Ascending' : 'Descending'}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 transition-transform duration-200 ${!sortAscending ? 'rotate-180' : ''}`} />
          </button>

          {/* Reset Filters if Active */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-[var(--rust)] hover:text-white hover:bg-[var(--rust)]/20 px-2.5 py-1.5 rounded-full text-xs transition-colors border border-[var(--rust)]/40 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>{t.clearFilters}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 1: Deal Type Segmented Controls (Draft Parity) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="inline-flex bg-[var(--surface)] border border-[var(--border)] rounded-full p-0.5 gap-0.5 flex-wrap">
          {dealOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDealFilterChange(opt.value)}
              className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer whitespace-nowrap ${
                dealFilter === opt.value
                  ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-xs'
                  : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Property Type Segmented Controls (Draft Parity) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex bg-[var(--surface)] border border-[var(--border)] rounded-full p-0.5 gap-0.5 flex-wrap overflow-x-auto max-w-full">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTypeFilterChange(opt.value)}
              className={`px-3 py-1 text-xs rounded-full transition-all cursor-pointer whitespace-nowrap ${
                typeFilter === opt.value
                  ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-xs'
                  : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
