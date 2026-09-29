import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, Language, Currency, AccentTheme } from '../types';
import { ACCENT_THEMES, translations } from '../utils/translations';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Menu, 
  X, 
  Download, 
  RotateCcw,
  LayoutGrid, 
  Table, 
  GitFork, 
  MapPin, 
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  isDiscreet: boolean;
  onToggleDiscreet: () => void;
  activeTheme: AccentTheme;
  onThemeChange: (theme: AccentTheme) => void;
  onOpenNewProperty: () => void;
  onExportCsv: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  lang,
  onLangChange,
  currency,
  onCurrencyChange,
  isDiscreet,
  onToggleDiscreet,
  activeTheme,
  onThemeChange,
  onOpenNewProperty,
  onExportCsv,
  onResetData,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSwatchRowOpen, setIsSwatchRowOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative border-b border-[var(--border-soft)] px-6 lg:px-10 py-5 flex items-center justify-between gap-4 bg-[var(--bg)] z-30">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex flex-col">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onViewModeChange('grid'); }} 
          className="font-serif-fraunces text-2xl lg:text-[26px] font-medium tracking-tight text-[var(--ink)] hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Phoenix <span style={{ color: 'var(--accent)' }}>Ledger</span>
        </a>
        <span className="text-[12.5px] text-[var(--ink-dim)] mt-0.5 hidden sm:inline-block">
          {t.appSubtitle}
        </span>
      </div>

      {/* Zone 2: Navigation Links / View Switchers (clean unboxed/clean tabs) */}
      <nav className="hidden md:flex items-center gap-1 bg-[var(--surface)] p-1 rounded-md border border-[var(--border)]">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            viewMode === 'grid'
              ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-sm'
              : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
          title={t.viewGrid}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{t.viewGrid}</span>
        </button>

        <button
          onClick={() => onViewModeChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            viewMode === 'table'
              ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-sm'
              : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
          title={t.viewTable}
        >
          <Table className="w-3.5 h-3.5" />
          <span>{t.viewTable}</span>
        </button>

        <button
          onClick={() => onViewModeChange('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            viewMode === 'pipeline'
              ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-sm'
              : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
          title={t.viewPipeline}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>{t.viewPipeline}</span>
        </button>

        <button
          onClick={() => onViewModeChange('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            viewMode === 'map'
              ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-sm'
              : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
          title={t.viewMap}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.viewMap}</span>
        </button>

        <button
          onClick={() => onViewModeChange('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            viewMode === 'analytics'
              ? 'bg-[var(--accent)] text-[#14171C] font-semibold shadow-sm'
              : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
          }`}
          title={t.viewAnalytics}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t.viewAnalytics}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Discreet Mode, New Property, and Menu Panel) */}
      <div className="flex items-center gap-2.5">
        {/* Discreet Mode Shield Button */}
        <button
          onClick={onToggleDiscreet}
          className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap ${
            isDiscreet
              ? 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]'
              : 'bg-[var(--surface)] text-[var(--ink-dim)] border-[var(--border)] hover:border-[var(--ink-faint)] hover:text-[var(--ink)]'
          }`}
          title={t.discreetTooltip}
        >
          {isDiscreet ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {isDiscreet ? t.discreetModeOn : t.discreetModeOff}
          </span>
        </button>

        {/* New Property Button */}
        <button
          onClick={onOpenNewProperty}
          className="bg-[var(--accent)] hover:opacity-90 text-[#14171C] font-semibold text-xs px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition-opacity cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addProperty}</span>
        </button>

        {/* Menu Panel Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-9 h-8 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--ink-faint)] text-[var(--ink-dim)] hover:text-[var(--ink)] rounded flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Settings and Preferences"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Flyout Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 top-11 w-64 bg-[var(--surface-2)] border border-[var(--border)] rounded-md shadow-2xl p-4 flex flex-col gap-3.5 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
                <span className="text-[var(--ink-dim)] font-medium">{t.language}</span>
                {/* Language Switch knob */}
                <button
                  onClick={() => onLangChange(lang === 'en' ? 'es' : 'en')}
                  className="relative grid grid-cols-2 w-16 h-6 border border-[var(--border)] rounded-full bg-[var(--surface)] p-0.5 cursor-pointer"
                  title="Toggle EN / ES"
                >
                  <span className={`z-10 flex items-center justify-center text-[10px] font-bold transition-colors ${lang === 'en' ? 'text-[#14171C]' : 'text-[var(--ink-dim)]'}`}>
                    EN
                  </span>
                  <span className={`z-10 flex items-center justify-center text-[10px] font-bold transition-colors ${lang === 'es' ? 'text-[#14171C]' : 'text-[var(--ink-dim)]'}`}>
                    ES
                  </span>
                  <span
                    className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-[var(--accent)] transition-transform duration-200 ${
                      lang === 'es' ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-2.5">
                <span className="text-[var(--ink-dim)] font-medium">{t.currency}</span>
                <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded p-0.5">
                  {(['MXN', 'USD', 'EUR'] as Currency[]).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => onCurrencyChange(curr)}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                        currency === curr
                          ? 'bg-[var(--accent)] text-[#14171C] font-semibold'
                          : 'text-[var(--ink-dim)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Accent Picker */}
              <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--ink-dim)] font-medium">{t.accentColor}</span>
                  <button
                    onClick={() => setIsSwatchRowOpen(!isSwatchRowOpen)}
                    className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer shadow"
                    style={{ backgroundColor: activeTheme.hex }}
                    title={activeTheme.name}
                  />
                </div>

                {isSwatchRowOpen && (
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {ACCENT_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme)}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          activeTheme.id === theme.id ? 'scale-125 border-white ring-2 ring-white/20' : 'border-white/10 hover:scale-110'
                        }`}
                        style={{ backgroundColor: theme.hex }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile View Switcher */}
              <div className="md:hidden flex flex-col gap-1 border-b border-[var(--border-soft)] pb-2.5">
                <span className="text-[var(--ink-dim)] font-medium mb-1">Views</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => { onViewModeChange('grid'); setIsMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded text-left ${viewMode === 'grid' ? 'bg-[var(--accent)] text-[#14171C]' : 'bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {t.viewGrid}
                  </button>
                  <button
                    onClick={() => { onViewModeChange('table'); setIsMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded text-left ${viewMode === 'table' ? 'bg-[var(--accent)] text-[#14171C]' : 'bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {t.viewTable}
                  </button>
                  <button
                    onClick={() => { onViewModeChange('pipeline'); setIsMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded text-left ${viewMode === 'pipeline' ? 'bg-[var(--accent)] text-[#14171C]' : 'bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {t.viewPipeline}
                  </button>
                  <button
                    onClick={() => { onViewModeChange('map'); setIsMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded text-left ${viewMode === 'map' ? 'bg-[var(--accent)] text-[#14171C]' : 'bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {t.viewMap}
                  </button>
                  <button
                    onClick={() => { onViewModeChange('analytics'); setIsMenuOpen(false); }}
                    className={`px-2 py-1.5 rounded text-left ${viewMode === 'analytics' ? 'bg-[var(--accent)] text-[#14171C]' : 'bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {t.viewAnalytics}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => { onExportCsv(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[var(--ink-dim)] hover:text-[var(--ink)] hover:bg-[var(--surface)] rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.exportCsv}</span>
                </button>

                <button
                  onClick={() => { onResetData(); setIsMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-[var(--rust)] hover:bg-[var(--surface)] rounded transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Restaurar datos predeterminados' : 'Restore default ledger'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
