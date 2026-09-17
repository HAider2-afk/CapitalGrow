import React, { useState, useEffect } from 'react';
import { Palette, Type, Check, Sparkles, ChevronDown } from 'lucide-react';

export interface ThemeOption {
  id: string;
  name: string;
  colorHex: string;
  secondaryHex: string;
  badge: string;
}

export interface FontOption {
  id: string;
  name: string;
  preview: string;
  sub: string;
}

export const THEMES: ThemeOption[] = [
  { id: 'default', name: 'Cobalt Sapphire', colorHex: '#2563EB', secondaryHex: '#3B82F6', badge: 'Modern Fintech' },
  { id: 'violet', name: 'Royal Amethyst', colorHex: '#7C3AED', secondaryHex: '#A78BFA', badge: 'High-Tech' },
  { id: 'gold', name: 'Swiss Gold', colorHex: '#D97706', secondaryHex: '#FBBF24', badge: 'Private Wealth' },
  { id: 'cyan', name: 'Electric Cyan', colorHex: '#0891B2', secondaryHex: '#22D3EE', badge: 'Cyber Capital' },
  { id: 'emerald', name: 'Classic Emerald', colorHex: '#059669', secondaryHex: '#34D399', badge: 'ESG Growth' },
  { id: 'crimson', name: 'Velocity Ruby', colorHex: '#E11D48', secondaryHex: '#FB7185', badge: 'Venture Capital' }
];

export const FONTS: FontOption[] = [
  { id: 'outfit', name: 'Outfit & Jakarta', preview: 'AaBb 123', sub: 'Geometric & Crisp Sans' },
  { id: 'grotesk', name: 'Space Grotesk', preview: 'AaBb 123', sub: 'Tech-Forward Grotesque' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', preview: 'AaBb 123', sub: 'Executive Neobank' },
  { id: 'mono', name: 'JetBrains Terminal', preview: 'AaBb 123', sub: 'Quant Hedge-Fund Mono' }
];

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    return localStorage.getItem('capitalgrow_theme') || 'default';
  });
  const [activeFont, setActiveFont] = useState<string>(() => {
    return localStorage.getItem('capitalgrow_font') || 'outfit';
  });

  // Apply theme & font to HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (activeTheme === 'default') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', activeTheme);
    }
    localStorage.setItem('capitalgrow_theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font', activeFont);
    localStorage.setItem('capitalgrow_font', activeFont);
  }, [activeFont]);

  const currentThemeObj = THEMES.find((t) => t.id === activeTheme) || THEMES[0];
  const currentFontObj = FONTS.find((f) => f.id === activeFont) || FONTS[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer"
        title="Change App Colors & Typography Style"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shadow-xs ring-1 ring-black/10 flex-shrink-0"
          style={{ backgroundColor: currentThemeObj.colorHex }}
        />
        <span className="hidden sm:inline font-medium">{currentThemeObj.name}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Colors Section */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Color Theme</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Live Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {THEMES.map((theme) => {
                const isSelected = activeTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setActiveTheme(theme.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: theme.colorHex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{theme.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{theme.badge}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Font Style Section */}
            <div className="flex items-center justify-between pt-3.5 mt-3 border-t border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Type className="w-3.5 h-3.5 text-emerald-600" />
                <span>Typography & Font Style</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">{currentFontObj.name}</span>
            </div>

            <div className="space-y-1.5">
              {FONTS.map((font) => {
                const isSelected = activeFont === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setActiveFont(font.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{font.name}</div>
                      <div className="text-[10px] text-slate-400">{font.sub}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {font.preview}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Instantly applied globally</span>
              <button
                type="button"
                onClick={() => {
                  setActiveTheme('default');
                  setActiveFont('outfit');
                }}
                className="text-emerald-600 hover:underline cursor-pointer font-medium"
              >
                Reset Default
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
