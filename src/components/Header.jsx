import React, { useState } from 'react';
import { 
  Feather, 
  Copy, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Fingerprint,
  BookOpen,
  FileText,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { COVER_STYLES } from '../constants/notebooks';
import { useTranslation } from '../i18n/LanguageContext';

export function Header({
  notebookTitle,
  coverId,
  onOpenNotebooks,
  onOpenCloner,
  hasClonedFont,
  text,
  settingsOpen,
  onToggleSettings,
  viewMode,
  onToggleViewMode,
  soundEnabled,
  onToggleSound,
  onToggleZen,
  lastSaved
}) {
  const { t, langCode, changeLanguage, languages } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

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
    <header className="w-full bg-[#FAF7F0]/85 backdrop-blur-md border-b border-[#E3DBD0]/80 sticky top-0 z-30 transition-all select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity + Active Notebook Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-2 border-r border-stone-300/60">
            <span className="w-6 h-6 rounded-md bg-[#2A1D15] text-[#FAF7F0] flex items-center justify-center shadow-xs">
              <Feather className="w-3.5 h-3.5" />
            </span>
            <span className="font-serif text-base font-semibold tracking-tight text-[#2A1D15]">
              Scriptor
            </span>
          </div>

          {/* Active Notebook Button */}
          <button
            onClick={onOpenNotebooks}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-stone-200/50 transition-colors group"
            title={t('myNotebooks')}
          >
            <span className={`w-3 h-3 rounded-xs ${activeCover.bgClass} shadow-xs border border-black/15`}></span>
            <span className="text-xs font-serif font-medium text-stone-800 group-hover:text-amber-950 transition-colors">
              {notebookTitle}
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-colors" />
          </button>
        </div>

        {/* Center: Save state indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-stone-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600/70"></span>
          <span>{lastSaved ? 'Kaydedildi' : 'Otomatik Kayıt'}</span>
        </div>

        {/* Right: View Mode, Cloner, Sound, Copy & Settings */}
        <div className="flex items-center gap-2">
          
          {/* Spread Mode Toggle (Single vs Two-Page Spread) */}
          <button
            onClick={onToggleViewMode}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              viewMode === 'spread'
                ? 'bg-amber-900/10 border-amber-800/40 text-amber-950 font-semibold'
                : 'bg-white/80 border-stone-300/70 text-stone-600 hover:bg-white'
            }`}
            title="Çift Sayfa / Tek Sayfa Görünümü"
          >
            {viewMode === 'spread' ? <BookOpen className="w-3.5 h-3.5 text-amber-800" /> : <FileText className="w-3.5 h-3.5 text-stone-500" />}
            <span className="text-[11px]">{viewMode === 'spread' ? 'Açık Defter' : 'Tek Sayfa'}</span>
          </button>

          {/* Handwriting Cloner Studio */}
          <button
            onClick={onOpenCloner}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
              hasClonedFont
                ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                : 'bg-white/80 border-stone-300/70 text-stone-600 hover:bg-white'
            }`}
            title={t('cloneSubtitle')}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden lg:inline text-[11px]">
              {hasClonedFont ? t('clonedFontActive') : t('cloneHandwriting')}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-amber-100/60 border-amber-300/80 text-amber-900'
                : 'bg-white/80 border-stone-300/70 text-stone-400'
            }`}
            title={soundEnabled ? "Mürekkep sesini kapat" : "Mürekkep sesini aç"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Zen Focus Mode Button */}
          <button
            onClick={onToggleZen}
            className="p-1.5 rounded-lg border border-stone-300/70 bg-white/80 text-stone-600 hover:bg-white hover:text-stone-900 transition-all"
            title="Zen Odak Modu"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!text}
            title={t('copy')}
            className={`p-1.5 rounded-lg border transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white/80 border-stone-300/70 text-stone-600 hover:bg-white disabled:opacity-30'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2 py-1 rounded-lg border border-stone-300/70 bg-white/80 text-xs font-semibold text-stone-700 hover:bg-white transition-all flex items-center gap-1"
            >
              <span>{currentLangObj.flag}</span>
              <span className="uppercase text-[10px]">{currentLangObj.code}</span>
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)}></div>
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 text-xs text-left flex items-center justify-between hover:bg-stone-50 ${
                        langCode === l.code ? 'font-bold text-amber-900 bg-amber-50/70' : 'text-stone-700'
                      }`}
                    >
                      <span>{l.flag} {l.name}</span>
                      {langCode === l.code && <Check className="w-3 h-3 text-amber-800" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Settings Drawer Button */}
          <button
            onClick={onToggleSettings}
            className={`p-1.5 rounded-lg border transition-all ${
              settingsOpen
                ? 'bg-stone-900 text-stone-100 border-stone-950 shadow-xs'
                : 'bg-white/80 text-stone-700 hover:bg-white border-stone-300/70'
            }`}
            title={t('settings')}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
