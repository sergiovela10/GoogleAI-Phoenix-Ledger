import React, { useState, useEffect, useMemo } from 'react';
import { 
  Property, 
  ViewMode, 
  Currency, 
  Language, 
  AccentTheme, 
  DealType, 
  PropertyType, 
  PropertyStatus,
  PropertyFile
} from './types';
import { INITIAL_PROPERTIES } from './data/mockProperties';
import { ACCENT_THEMES, translations } from './utils/translations';
import { getExpiryStatus, formatCurrency } from './utils/formatters';

import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ControlsBar } from './components/ControlsBar';
import { PropertyCard } from './components/PropertyCard';
import { PropertyTableView } from './components/PropertyTableView';
import { PropertyPipelineView } from './components/PropertyPipelineView';
import { PropertyMapView } from './components/PropertyMapView';
import { PropertyAnalyticsView } from './components/PropertyAnalyticsView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { ExecutiveTeaserModal } from './components/ExecutiveTeaserModal';

const STORAGE_KEY = 'phoenix_ledger_properties_v2';
const THEME_KEY = 'phoenix_ledger_theme';
const LANG_KEY = 'phoenix_ledger_lang';
const CURRENCY_KEY = 'phoenix_ledger_currency';
const DISCREET_KEY = 'phoenix_ledger_discreet';

export default function App() {
  // 1. Core State
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved properties', e);
    }
    return INITIAL_PROPERTIES;
  });

  const [activeTheme, setActiveTheme] = useState<AccentTheme>(() => {
    const savedId = localStorage.getItem(THEME_KEY);
    return ACCENT_THEMES.find(t => t.id === savedId) || ACCENT_THEMES[0];
  });

  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(LANG_KEY) as Language) || 'en';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as Currency) || 'MXN';
  });

  const [isDiscreet, setIsDiscreet] = useState<boolean>(() => {
    return localStorage.getItem(DISCREET_KEY) === 'true';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // 2. Filters and Search State
  const [dealFilter, setDealFilter] = useState<DealType | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<PropertyType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'All'>('All');
  const [sortField, setSortField] = useState<'date' | 'price' | 'size' | 'expiry'>('date');
  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterExpiringUrgent, setFilterExpiringUrgent] = useState<boolean>(false);

  // 3. Modals State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [teaserProperty, setTeaserProperty] = useState<Property | null>(null);

  // Apply Theme CSS Custom Variables
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', activeTheme.hex);
    document.documentElement.style.setProperty('--accent-soft', activeTheme.soft);
    localStorage.setItem(THEME_KEY, activeTheme.id);
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(DISCREET_KEY, String(isDiscreet));
  }, [isDiscreet]);

  // Handler Actions
  const handleToggleDiscreet = () => setIsDiscreet(prev => !prev);

  const handleResetData = () => {
    if (window.confirm(lang === 'es' ? '¿Restaurar los registros originales de Monterrey?' : 'Restore default Monterrey property records?')) {
      setProperties(INITIAL_PROPERTIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
    }
  };

  const handleSaveProperty = (prop: Property) => {
    setProperties(prev => {
      const exists = prev.some(p => p.id === prop.id);
      if (exists) {
        return prev.map(p => p.id === prop.id ? prop : p);
      }
      return [prop, ...prev];
    });

    if (selectedProperty && selectedProperty.id === prop.id) {
      setSelectedProperty(prop);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    if (selectedProperty?.id === propertyId) {
      setSelectedProperty(null);
    }
  };

  const handleAddNote = (propertyId: string, noteText: string) => {
    const updated = properties.map(p => {
      if (p.id === propertyId) {
        const newNote = {
          id: `n-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: lang === 'es' ? 'Asesor Privado' : 'Senior Broker',
          note: noteText,
        };
        const updatedProp = {
          ...p,
          negotiationNotes: [newNote, ...p.negotiationNotes],
        };
        if (selectedProperty?.id === propertyId) {
          setSelectedProperty(updatedProp);
        }
        return updatedProp;
      }
      return p;
    });
    setProperties(updated);
  };

  const handleAddFile = (propertyId: string, file: PropertyFile) => {
    const updated = properties.map(p => {
      if (p.id === propertyId) {
        const updatedProp = {
          ...p,
          files: [file, ...p.files],
        };
        if (selectedProperty?.id === propertyId) {
          setSelectedProperty(updatedProp);
        }
        return updatedProp;
      }
      return p;
    });
    setProperties(updated);
  };

  const handleUpdateStatus = (propertyId: string, nextStatus: PropertyStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updated = { ...p, status: nextStatus };
        if (selectedProperty?.id === propertyId) {
          setSelectedProperty(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  const handleExportCsv = () => {
    const headers = [
      'ID', 'Title', 'District', 'Type', 'DealType', 'Status', 
      'Price_MXN', 'LandArea_M2', 'BuiltArea_M2', 'MandateExpiry', 'ContactName', 'ContactPhone', 'Zoning'
    ];
    const rows = filteredProperties.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.district}"`,
      p.type,
      p.dealType,
      p.status,
      p.priceMxn,
      p.landAreaM2,
      p.builtAreaM2 || '',
      p.mandateExpiryDate || '',
      `"${p.brokerContact?.name || ''}"`,
      `"${p.brokerContact?.phone || ''}"`,
      `"${p.zoning}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Phoenix_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setDealFilter('All');
    setTypeFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
    setFilterExpiringUrgent(false);
  };

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Deal filter
      if (dealFilter !== 'All' && prop.dealType !== dealFilter && prop.dealType !== 'Both') {
        return false;
      }
      // Type filter
      if (typeFilter !== 'All' && prop.type !== typeFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && prop.status !== statusFilter) {
        return false;
      }
      // Expiring urgent filter
      if (filterExpiringUrgent) {
        const exp = getExpiryStatus(prop.mandateExpiryDate, lang);
        if (!exp.isUrgent) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesDistrict = prop.district.toLowerCase().includes(q);
        const matchesAddress = prop.address.toLowerCase().includes(q);
        const matchesBroker = prop.brokerContact?.name.toLowerCase().includes(q);
        const matchesNotes = prop.negotiationNotes.some(n => n.note.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDistrict && !matchesAddress && !matchesBroker && !matchesNotes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortField === 'price') {
        comparison = b.priceMxn - a.priceMxn;
      } else if (sortField === 'size') {
        comparison = b.landAreaM2 - a.landAreaM2;
      } else if (sortField === 'expiry') {
        const daysA = getExpiryStatus(a.mandateExpiryDate, lang).daysLeft ?? 9999;
        const daysB = getExpiryStatus(b.mandateExpiryDate, lang).daysLeft ?? 9999;
        comparison = daysA - daysB;
      }
      return sortAscending ? -comparison : comparison;
    });
  }, [properties, dealFilter, typeFilter, statusFilter, filterExpiringUrgent, searchQuery, sortField, sortAscending, lang]);

  const isFiltered = dealFilter !== 'All' || typeFilter !== 'All' || statusFilter !== 'All' || searchQuery !== '' || filterExpiringUrgent;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col antialiased">
      {/* 1. Top Navigation Bar (Clean 3-Zone Contract) */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        lang={lang}
        onLangChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        isDiscreet={isDiscreet}
        onToggleDiscreet={handleToggleDiscreet}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        onOpenNewProperty={() => {
          setEditingProperty(null);
          setIsAddEditOpen(true);
        }}
        onExportCsv={handleExportCsv}
        onResetData={handleResetData}
      />

      {/* 3. Dynamic Stats Bar (Auto-fit calculations, deal splits, footprint) */}
      <StatsBar
        properties={properties}
        currency={currency}
        lang={lang}
        isDiscreet={isDiscreet}
        onFilterExpiring={() => setFilterExpiringUrgent(!filterExpiringUrgent)}
        isExpiringFiltered={filterExpiringUrgent}
      />

      {/* 4. Controls: Pill Filters, Sort, Search (Full Parity with Draft + Enhancements) */}
      <ControlsBar
        dealFilter={dealFilter}
        onDealFilterChange={setDealFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortAscending={sortAscending}
        onToggleSortDirection={() => setSortAscending(!sortAscending)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        lang={lang}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 5. Main Content Area According to View Mode */}
      <main className="flex-1">
        {filteredProperties.length === 0 ? (
          <div className="px-6 lg:px-10 py-16 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--ink-faint)]">
              ∅
            </div>
            <p className="text-sm text-[var(--ink-dim)]">
              {translations[lang].noPropertiesFound}
            </p>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[var(--accent)] hover:underline cursor-pointer font-medium"
            >
              {translations[lang].clearFilters}
            </button>
          </div>
        ) : (
          <>
            {/* Visual Card Grid View (Full Parity with Draft Cards) */}
            {viewMode === 'grid' && (
              <div className="px-6 lg:px-10 py-5 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    currency={currency}
                    lang={lang}
                    isDiscreet={isDiscreet}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>
            )}

            {/* Dense Financial Table Ledger View */}
            {viewMode === 'table' && (
              <PropertyTableView
                properties={filteredProperties}
                currency={currency}
                lang={lang}
                isDiscreet={isDiscreet}
                onSelect={setSelectedProperty}
              />
            )}

            {/* CRM Deal Pipeline Kanban View */}
            {viewMode === 'pipeline' && (
              <PropertyPipelineView
                properties={filteredProperties}
                currency={currency}
                lang={lang}
                isDiscreet={isDiscreet}
                onSelect={setSelectedProperty}
                onUpdateStatus={handleUpdateStatus}
              />
            )}

            {/* Interactive District Map View */}
            {viewMode === 'map' && (
              <PropertyMapView
                properties={filteredProperties}
                currency={currency}
                lang={lang}
                isDiscreet={isDiscreet}
                onSelect={setSelectedProperty}
              />
            )}

            {/* Portfolio Analytics View */}
            {viewMode === 'analytics' && (
              <PropertyAnalyticsView
                properties={filteredProperties}
                currency={currency}
                lang={lang}
                isDiscreet={isDiscreet}
              />
            )}
          </>
        )}
      </main>

      {/* 6. Footer (Minimal, Anti-Slop, Clean Trust Marker) */}
      <footer className="border-t border-[var(--border-soft)] px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--ink-faint)] gap-2 bg-[var(--bg)]">
        <div className="flex items-center gap-3">
          <span className="font-serif-fraunces text-[var(--ink-dim)]">Phoenix Ledger</span>
          <span>·</span>
          <span>Monterrey Private Office</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>{properties.length} {lang === 'es' ? 'activos en cartera' : 'portfolio assets'}</span>
          <span>·</span>
          <span>{lang === 'es' ? 'Cifrado local activo' : 'Client-side encrypted'}</span>
        </div>
      </footer>

      {/* 7. Modals */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          currency={currency}
          lang={lang}
          isDiscreet={isDiscreet}
          onEdit={(prop) => {
            setEditingProperty(prop);
            setIsAddEditOpen(true);
          }}
          onDelete={handleDeleteProperty}
          onAddNote={handleAddNote}
          onAddFile={handleAddFile}
          onOpenTeaser={(prop) => setTeaserProperty(prop)}
        />
      )}

      {isAddEditOpen && (
        <AddEditPropertyModal
          initialProperty={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => {
            setIsAddEditOpen(false);
            setEditingProperty(null);
          }}
          lang={lang}
        />
      )}

      {teaserProperty && (
        <ExecutiveTeaserModal
          property={teaserProperty}
          onClose={() => setTeaserProperty(null)}
          currency={currency}
          lang={lang}
          isDiscreet={isDiscreet}
        />
      )}
    </div>
  );
}
