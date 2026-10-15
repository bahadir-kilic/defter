import React from 'react';
import { HANDWRITING_FONTS } from '../constants/fonts';
import { INK_COLORS, PAPER_STYLES } from '../constants/colors';
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
  const isClonedActive = fontId === 'cloned-personal-font';
  const currentFont = isClonedActive 
    ? { name: 'Kendi El Yazım (Klon)', category: 'Kişisel AI Klon', turkish: true, sample: 'Bu benim taranmış ve klonlanmış kendi el yazımdır.' }
    : (HANDWRITING_FONTS.find(f => f.id === fontId) || HANDWRITING_FONTS[0]);

  return (
    <div className="w-full bg-[#fdfbf7] border-b border-[#e8dfcf] shadow-xs py-3 px-4 sm:px-6 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col gap-3.5">
        
        {/* Main Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
          
          {/* 1. Font Tipi Seçimi */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-700" />
                El Yazısı Tipi
              </span>
              <span className="text-[11px] font-normal text-stone-400">
                {currentFont.category} • {currentFont.turkish ? '🇹🇷 Tam Türkçe' : 'Latin'}
              </span>
            </div>

            <div className="relative">
              <select
                value={fontId}
                onChange={(e) => onFontChange(e.target.value)}
                className={`w-full h-10 pl-3 pr-8 text-sm font-medium bg-white border rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 appearance-none cursor-pointer transition-all ${
                  isClonedActive 
                    ? 'border-amber-600 text-amber-950 font-semibold bg-amber-50/30' 
                    : 'border-stone-300 text-stone-800'
                }`}
              >
                {/* Cloned Font Option (if exists) */}
                {clonedProfile && (
                  <option value="cloned-personal-font" className="font-bold py-1 bg-amber-50">
                    ⭐ Kendi El Yazım (Bireysel AI Klon)
                  </option>
                )}

                {HANDWRITING_FONTS.map((font) => (
                  <option key={font.id} value={font.id} className="py-1">
                    {font.name} — {font.category} {font.turkish ? '(Türkçe Destekli)' : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Live Sample Pill */}
            <div className="flex items-center justify-between text-xs">
              <div 
                className="text-stone-700 text-base px-2 py-0.5 rounded bg-stone-100/60 truncate border border-stone-200/50 flex-1"
                style={{ 
                  fontFamily: isClonedActive ? "'Caveat', cursive" : currentFont.fontFamily,
                  transform: isClonedActive ? `skewX(-${clonedProfile?.metrics?.slant || 3}deg)` : undefined
                }}
              >
                {currentFont.sample}
              </div>

              {isClonedActive && onOpenCloner && (
                <button
                  onClick={onOpenCloner}
                  className="ml-2 text-[11px] text-amber-900 font-semibold hover:underline flex items-center gap-1 flex-shrink-0"
                >
                  <Fingerprint className="w-3 h-3" />
                  <span>Yeniden Kalibre Et</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Font Büyüklüğü */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
                Yazı Boyutu
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[11px] font-bold">
                {fontSize}px
              </span>
            </div>

            <div className="flex items-center gap-2 h-10 px-2 bg-white border border-stone-300 rounded-lg shadow-xs">
              <input
                type="range"
                min="18"
                max="44"
                step="1"
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />
            </div>

            {/* Preset Size Buttons */}
            <div className="flex items-center justify-between gap-1 text-[11px]">
              {[
                { label: 'Küçük', size: 20 },
                { label: 'Normal', size: 24 },
                { label: 'Büyük', size: 30 },
                { label: 'Manşet', size: 38 }
              ].map((preset) => (
                <button
                  key={preset.size}
                  onClick={() => onFontSizeChange(preset.size)}
                  className={`flex-1 py-0.5 rounded border transition-all text-center ${
                    fontSize === preset.size
                      ? 'bg-amber-800 text-white border-amber-900 font-medium'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Mürekkep Rengi */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-700" />
                Mürekkep Rengi
              </span>
              <span className="text-[11px] text-stone-400 font-mono truncate max-w-[120px]">
                {INK_COLORS.find(c => c.hex.toLowerCase() === inkColor.toLowerCase())?.name || inkColor}
              </span>
            </div>

            <div className="flex items-center gap-1.5 h-10 px-2 bg-white border border-stone-300 rounded-lg shadow-xs overflow-x-auto">
              {INK_COLORS.map((ink) => (
                <button
                  key={ink.id}
                  onClick={() => onInkColorChange(ink.hex)}
                  title={`${ink.name} (${ink.description})`}
                  className={`relative w-6 h-6 rounded-full flex-shrink-0 transition-transform hover:scale-110 flex items-center justify-center ${ink.dotClass} ${
                    inkColor.toLowerCase() === ink.hex.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-amber-800 scale-105'
                      : 'border border-black/10'
                  }`}
                >
                  {inkColor.toLowerCase() === ink.hex.toLowerCase() && (
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  )}
                </button>
              ))}

              {/* Custom Color Input */}
              <label 
                title="Özel Renk Seç"
                className="relative w-6 h-6 rounded-full flex-shrink-0 cursor-pointer border border-stone-300 bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500 hover:scale-110 transition-transform flex items-center justify-center overflow-hidden"
              >
                <input
                  type="color"
                  value={inkColor}
                  onChange={(e) => onInkColorChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>

            {/* Quick Color Description */}
            <div className="text-[11px] text-stone-500 truncate">
              {INK_COLORS.find(c => c.hex.toLowerCase() === inkColor.toLowerCase())?.description || 'Özel seçilmiş mürekkep tonu'}
            </div>
          </div>

        </div>

        {/* Secondary Row: Paper Style & Ink Dynamics */}
        <div className="pt-2.5 border-t border-stone-200/70 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Kağıt Tipi Seçici */}
          <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Kağıt Zemini:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {PAPER_STYLES.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => onPaperChange(paper.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex-shrink-0 flex items-center gap-1.5 ${
                    paperId === paper.id
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-medium shadow-xs'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full border border-stone-300 ${paper.previewBg}`}></span>
                  <span>{paper.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mürekkep Yoğunluğu & Lif Efekti */}
          <div className="md:col-span-4 flex items-center justify-end gap-3 text-xs">
            <div className="flex items-center gap-1.5" title="Mürekkep ıslaklığı / yoğunluğu">
              <Droplet className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-stone-600 hidden sm:inline">Yoğunluk:</span>
              <input
                type="range"
                min="0.75"
                max="1"
                step="0.05"
                value={inkOpacity}
                onChange={(e) => onInkOpacityChange(Number(e.target.value))}
                className="w-16 accent-amber-800 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
              />
              <span className="font-mono text-[10px] text-stone-500 w-7">
                {Math.round(inkOpacity * 100)}%
              </span>
            </div>

            <button
              onClick={() => onInkBleedChange(!inkBleed)}
              className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition-all ${
                inkBleed
                  ? 'bg-stone-800 text-stone-100 border-stone-900'
                  : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
              }`}
              title="Kağıt liflerine sızan mürekkep dağılması efekti"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Lif Efekti</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
