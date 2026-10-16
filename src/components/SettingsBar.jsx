import React from 'react';
import { HANDWRITING_FONTS } from '../constants/fonts';
import { INK_COLORS, PAPER_STYLES } from '../constants/colors';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Type, 
  Palette, 
  FileText, 
  Droplet, 
  Maximize2, 
  Check, 
  Sparkles,
  ChevronDown,
  Fingerprint
} from 'lucide-react';

export function SettingsBar({
  fontId,
  onFontChange,
  fontSize,
  onFontSizeChange,
  inkColor,
  onInkColorChange,
  paperId,
  onPaperChange,
  inkOpacity,
  onInkOpacityChange,
  inkBleed,
  onInkBleedChange,
  clonedProfile,
  onOpenCloner
}) {
  const { t } = useTranslation();
  const isClonedActive = fontId === 'cloned-personal-font';

  const currentFont = isClonedActive 
    ? { name: t('clonedFontActive'), category: 'Bireysel AI Klon', sample: t('pangram') }
    : (HANDWRITING_FONTS.find(f => f.id === fontId) || HANDWRITING_FONTS[0]);

  return (
    <div className="w-full bg-[#FAF7F0] border-b border-[#E3DBD0]/80 shadow-xs py-2.5 px-4 sm:px-6 transition-all select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        
        {/* Row 1: Font Family, Font Size, and Inks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* 1. Font Family Picker */}
          <div className="md:col-span-5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-stone-600">
              <span className="flex items-center gap-1.5 font-serif font-semibold text-stone-800">
                <Type className="w-3.5 h-3.5 text-amber-900" />
                {t('fontType')}
              </span>
              <span className="text-[10px] text-stone-400">
                {currentFont.category}
              </span>
            </div>

            <div className="relative">
              <select
                value={fontId}
                onChange={(e) => onFontChange(e.target.value)}
                className={`w-full h-8 pl-2.5 pr-7 text-xs font-medium bg-white border rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-amber-900 appearance-none cursor-pointer transition-all ${
                  isClonedActive 
                    ? 'border-amber-700 text-amber-950 font-semibold bg-amber-50/40' 
                    : 'border-stone-300/80 text-stone-800'
                }`}
              >
                {clonedProfile && (
                  <option value="cloned-personal-font" className="font-bold py-1 bg-amber-50">
                    ⭐ {t('clonedFontActive')}
                  </option>
                )}
                {HANDWRITING_FONTS.map((font) => (
                  <option key={font.id} value={font.id} className="py-1">
                    {font.name} — {font.category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* 2. Font Size Slider */}
          <div className="md:col-span-3 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-stone-600">
              <span className="flex items-center gap-1.5 font-serif font-semibold text-stone-800">
                <Maximize2 className="w-3.5 h-3.5 text-amber-900" />
                {t('fontSize')}
              </span>
              <span className="text-[10px] font-mono text-amber-950 font-bold bg-amber-100/70 px-1 rounded">
                {fontSize}px
              </span>
            </div>

            <div className="flex items-center gap-2 h-8 px-2 bg-white border border-stone-300/80 rounded-lg shadow-2xs">
              <input
                type="range"
                min="18"
                max="44"
                step="1"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full accent-amber-900 cursor-pointer h-1 bg-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* 3. Ink Swatches */}
          <div className="md:col-span-4 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-stone-600">
              <span className="flex items-center gap-1.5 font-serif font-semibold text-stone-800">
                <Palette className="w-3.5 h-3.5 text-amber-900" />
                {t('inkColor')}
              </span>
              <span className="text-[10px] text-stone-400 font-mono truncate max-w-[120px]">
                {INK_COLORS.find(c => c.hex.toLowerCase() === inkColor.toLowerCase())?.name || inkColor}
              </span>
            </div>

            <div className="flex items-center gap-1.5 h-8 px-2 bg-white border border-stone-300/80 rounded-lg shadow-2xs overflow-x-auto">
              {INK_COLORS.map((ink) => (
                <button
                  key={ink.id}
                  onClick={() => onInkColorChange(ink.hex)}
                  title={`${ink.name} (${ink.description})`}
                  className={`relative w-5 h-5 rounded-full flex-shrink-0 transition-transform hover:scale-110 flex items-center justify-center ${ink.dotClass} ${
                    inkColor.toLowerCase() === ink.hex.toLowerCase()
                      ? 'ring-2 ring-offset-1 ring-amber-900 scale-105'
                      : 'border border-black/10'
                  }`}
                >
                  {inkColor.toLowerCase() === ink.hex.toLowerCase() && (
                    <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                  )}
                </button>
              ))}

              {/* Custom Color Input */}
              <label 
                title="Color Picker"
                className="relative w-5 h-5 rounded-full flex-shrink-0 cursor-pointer border border-stone-300 bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden"
              >
                <input
                  type="color"
                  value={inkColor}
                  onChange={(e) => onInkColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Row 2: Paper Textures and Ink Density */}
        <div className="pt-2 border-t border-stone-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          
          {/* Paper Texture Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-serif font-semibold text-stone-700 flex items-center gap-1 flex-shrink-0">
              <FileText className="w-3 h-3 text-amber-900" />
              {t('paperStyle')}:
            </span>
            {PAPER_STYLES.map((paper) => (
              <button
                key={paper.id}
                onClick={() => onPaperChange(paper.id)}
                className={`px-2 py-0.5 text-[11px] rounded-md border transition-all flex-shrink-0 flex items-center gap-1.5 ${
                  paperId === paper.id
                    ? 'bg-amber-100/90 text-amber-950 border-amber-300 font-semibold shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full border border-stone-300 ${paper.previewBg}`}></span>
                <span>{paper.name}</span>
              </button>
            ))}
          </div>

          {/* Ink Bleed & Flow */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px] text-stone-600" title={t('inkOpacity')}>
              <Droplet className="w-3 h-3 text-stone-400" />
              <span>{Math.round(inkOpacity * 100)}%</span>
            </div>

            <button
              onClick={() => onInkBleedChange(!inkBleed)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] transition-all ${
                inkBleed
                  ? 'bg-stone-900 text-stone-100 border-stone-950 font-medium'
                  : 'bg-white text-stone-600 border-stone-200'
              }`}
              title={t('inkBleed')}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{t('inkBleed')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
