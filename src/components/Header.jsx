import React, { useState } from 'react';
import { 
  Feather, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal,
  ChevronDown,
  Fingerprint,
  Globe
} from 'lucide-react';
import { COVER_STYLES } from '../constants/notebooks';
import { useTranslation } from '../i18n/LanguageContext';

export function Header({
  notebookTitle,
  coverId,
  onOpenNotebooks,
  onOpenAiAssistant,
  onOpenCloner,
  hasClonedFont,
  text,
  onClear,
  settingsOpen,
  onToggleSettings
}) {
  const { t, langCode, changeLanguage, languages } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const activeCover = COVER_STYLES.find(c => c.id === coverId) || COVER_STYLES[0];
  const currentLangObj = languages.find(l => l.code === langCode) || languages[0];

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  return (
    <header className="w-full bg-[#fcfaf5]/90 backdrop-blur-md border-b border-[#e6decf] sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Brand + Active Notebook Selector Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-900 to-amber-700 text-amber-50 flex items-center justify-center shadow-md shadow-amber-900/10 flex-shrink-0">
            <Feather className="w-5 h-5 stroke-[2.2]" />
          </div>

          {/* Active Notebook Picker Pill */}
          <button
            onClick={onOpenNotebooks}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-stone-100/90 hover:bg-stone-200/80 border border-stone-300 rounded-xl text-left transition-all group"
            title={t('myNotebooks')}
          >
            <div className={`w-3.5 h-3.5 rounded-sm ${activeCover.bgClass} border border-black/20 shadow-xs flex-shrink-0`}></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800 font-serif group-hover:text-amber-950 transition-colors flex items-center gap-1 truncate max-w-[120px] sm:max-w-[180px]">
                {notebookTitle}
                <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 flex-shrink-0" />
              </span>
              <span className="text-[10px] text-stone-400 -mt-0.5 truncate max-w-[100px]">
                {activeCover.name}
              </span>
            </div>
          </button>
        </div>

        {/* Right: Language Selector + Handwriting Cloner + AI Assistant + Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-stone-300/80 bg-white hover:bg-stone-50 text-xs font-medium text-stone-700 shadow-2xs transition-all"
              title="Dil Seçimi / Change Language"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden sm:inline uppercase text-[11px] font-bold">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {langMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangMenuOpen(false)}
                ></div>
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-amber-50/70 transition-colors ${
                        langCode === l.code ? 'font-bold text-amber-900 bg-amber-50' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.name}</span>
                      </div>
                      {langCode === l.code && <Check className="w-3.5 h-3.5 text-amber-800" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Handwriting Cloner Button (The Moat Feature) */}
          <button
            onClick={onOpenCloner}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300/80 rounded-xl shadow-xs transition-all active:scale-95 group"
            title={t('cloneSubtitle')}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-800 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">
              {hasClonedFont ? t('clonedFontActive') : t('cloneHandwriting')}
            </span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 hover:from-amber-800 hover:to-stone-800 rounded-xl shadow-xs transition-all active:scale-95 border border-amber-950"
            title={t('aiModalSubtitle')}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">{t('aiInspiration')}</span>
          </button>

          {/* Stats Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-200/50 border border-stone-300/60 text-[11px] font-medium text-stone-600">
            <span>{words} {t('words')}</span>
            <span className="text-stone-300">•</span>
            <span>{chars} {t('chars')}</span>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!text}
            title={t('copy')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'text-stone-700 bg-stone-100 hover:bg-stone-200/80 border-stone-300/70 disabled:opacity-40 disabled:pointer-events-none'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">{t('copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">{t('copy')}</span>
              </>
            )}
          </button>

          {/* Clear Button */}
          {text && (
            <button
              onClick={onClear}
              title={t('clear')}
              className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Settings Toggle */}
          <button
            onClick={onToggleSettings}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              settingsOpen
                ? 'bg-amber-900 text-white border-amber-950 shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-300/80'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('settings')}</span>
          </button>

        </div>
      </div>
    </header>
  );
}
