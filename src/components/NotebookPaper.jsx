import React, { useRef, useEffect } from 'react';
import { HANDWRITING_FONTS } from '../constants/fonts';
import { PAPER_STYLES } from '../constants/colors';
import { COVER_STYLES } from '../constants/notebooks';
import { useTranslation } from '../i18n/LanguageContext';
import { ChevronLeft, ChevronRight, Plus, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export function NotebookPaper({
  pages,
  activePageIndex,
  onPageChange,
  onTextChange,
  fontId,
  fontSize,
  inkColor,
  paperId,
  coverId,
  inkOpacity,
  inkBleed,
  notebookTitle,
  clonedProfile,
  viewMode, // 'single' | 'spread'
  soundEnabled,
  onToggleSound,
  onToggleZen,
  onAddPage,
  onPrevPage,
  onNextPage
}) {
  const { t, currentLang } = useTranslation();
  const isRTL = currentLang.dir === 'rtl';

  const leftTextareaRef = useRef(null);
  const rightTextareaRef = useRef(null);

  const isCloned = fontId === 'cloned-personal-font';
  const selectedFont = isCloned 
    ? { id: 'cloned', name: t('clonedFontActive'), fontFamily: "'Caveat', cursive" }
    : (HANDWRITING_FONTS.find(f => f.id === fontId) || HANDWRITING_FONTS[0]);

  const selectedPaper = PAPER_STYLES.find(p => p.id === paperId) || PAPER_STYLES[0];
  const selectedCover = COVER_STYLES.find(c => c.id === coverId) || COVER_STYLES[0];

  // Mathematical baseline calibration:
  // line-height is locked to 1.58 ratio of font-size
  const calculatedLineHeight = Math.max(34, Math.round(fontSize * 1.58));
  // Exact offset for baseline alignment
  const topLineOffset = 26;
  const textareaPaddingTop = Math.max(14, topLineOffset - Math.round(fontSize * 0.22));

  const isSpread = viewMode === 'spread';
  const leftPageIdx = activePageIndex % 2 === 0 ? activePageIndex : activePageIndex - 1;
  const rightPageIdx = leftPageIdx + 1;

  const leftPage = pages[leftPageIdx] || { content: '', date: '' };
  const rightPage = pages[rightPageIdx] || (isSpread ? { content: '', date: '' } : null);

  // Auto-resize textarea heights
  useEffect(() => {
    if (leftTextareaRef.current) {
      leftTextareaRef.current.style.height = 'auto';
      leftTextareaRef.current.style.height = `${Math.max(leftTextareaRef.current.scrollHeight, 620)}px`;
    }
    if (rightTextareaRef.current) {
      rightTextareaRef.current.style.height = 'auto';
      rightTextareaRef.current.style.height = `${Math.max(rightTextareaRef.current.scrollHeight, 620)}px`;
    }
  }, [leftPage?.content, rightPage?.content, fontSize, calculatedLineHeight]);

  const fontStyle = {
    fontFamily: selectedFont.fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: `${calculatedLineHeight}px`,
    color: inkColor,
    opacity: inkOpacity,
    letterSpacing: isCloned 
      ? `${clonedProfile?.metrics?.letterSpacing || 0.04}em`
      : (selectedFont.id === 'kalam' ? '0.02em' : '0.01em'),
    transform: (isCloned && !isRTL) 
      ? `skewX(-${clonedProfile?.metrics?.slant || 3.5}deg)` 
      : undefined,
    fontWeight: isCloned && clonedProfile?.metrics?.strokeWidth > 2.8 ? '700' : '500',
    caretColor: inkColor,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    paddingTop: `${textareaPaddingTop}px`
  };

  const hasMargin = paperId === 'ruled' || paperId === 'legal';

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-4 select-none">
      
      {/* Outer Luxury Book Casing */}
      <div 
        className={`w-full relative transition-all duration-300 ${
          isSpread ? 'max-w-6xl' : 'max-w-3xl'
        }`}
        style={{
          '--line-height': `${calculatedLineHeight}px`,
          '--top-line-offset': `${topLineOffset}px`,
          '--margin-pos': hasMargin ? '68px' : '0px'
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        
        {/* Physical Hardcover Backing with Stitched Edges */}
        <div className={`absolute inset-0 -m-3 sm:-m-5 rounded-3xl ${selectedCover.bgClass} shadow-2xl transition-all -z-20`}>
          {/* Subtle perimeter deboss stitch */}
          <div className="absolute inset-2 sm:inset-3 rounded-2xl border border-dashed border-white/10 pointer-events-none"></div>
          {/* Moleskine Elastic Band on right edge */}
          <div className="absolute right-6 top-0 bottom-0 w-4 bg-black/40 shadow-inner rounded-xs pointer-events-none opacity-40"></div>
        </div>

        {/* Paper Block Elevation Shadow (Pages stacked underneath) */}
        <div className="absolute inset-0 bg-[#e4dcce] translate-y-2.5 translate-x-1 rounded-2xl -z-10 shadow-md"></div>
        <div className="absolute inset-0 bg-[#ede5d8] translate-y-1 translate-x-0.5 rounded-2xl -z-10 shadow-sm"></div>

        {/* Satin Bookmark Ribbon */}
        <div 
          className="absolute left-1/3 -top-6 w-5 h-36 bg-gradient-to-r from-red-900 via-rose-800 to-red-950 shadow-md rounded-b-xs -z-5 pointer-events-none transition-all"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)'
          }}
        ></div>

        {/* The Paper Surface Container */}
        <div 
          className={`relative w-full rounded-2xl shadow-2xl border border-stone-400/50 overflow-hidden paper-fiber transition-all ${
            isSpread ? 'grid grid-cols-1 md:grid-cols-2 open-book-spine' : 'flex flex-col'
          }`}
          style={{ minHeight: '740px' }}
        >

          {/* ──────────────── PAGE 1 (Left / Single) ──────────────── */}
          <div className={`relative flex flex-col ${selectedPaper.className} ${isSpread ? 'page-left-highlight border-b md:border-b-0 md:border-r border-stone-300/60' : ''}`}>
            
            {/* Page Header (Minimalist Date & Number) */}
            <div className="h-12 border-b border-stone-200/50 flex items-center justify-between px-6 sm:px-10 text-[11px] font-mono text-stone-400/80">
              <span className="tracking-wider uppercase font-serif text-stone-500 font-semibold">
                {notebookTitle}
              </span>
              <div className="flex items-center gap-3">
                <span>{t('pageOf', { current: leftPageIdx + 1, total: pages.length })}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString(currentLang.locale || 'tr-TR', { day: 'numeric', month: 'short' })}</span>
              </div>
            </div>

            {/* Editable Text Area */}
            <div className="flex-1 relative w-full pb-16">
              <textarea
                ref={leftTextareaRef}
                value={leftPage.content || ''}
                onChange={(e) => onTextChange(leftPageIdx, e.target.value)}
                placeholder={t('placeholderNotebook')}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                dir={isRTL ? 'rtl' : 'ltr'}
                className={`w-full bg-transparent resize-none border-none outline-none focus:ring-0 ${
                  hasMargin ? (isRTL ? 'pr-20 pl-6' : 'pl-20 pr-6') : 'px-8'
                } ${inkBleed ? 'ink-bleed' : ''} placeholder:text-stone-300/70`}
                style={fontStyle}
              />
            </div>

            {/* Subtle Watermark */}
            <div className="absolute bottom-3 left-6 text-[10px] font-serif text-stone-400/50 italic pointer-events-none">
              {selectedFont.name}
            </div>
          </div>

          {/* ──────────────── PAGE 2 (Right Page in Spread Mode) ──────────────── */}
          {isSpread && (
            <div className={`relative flex flex-col ${selectedPaper.className} page-right-highlight`}>
              
              {/* Page Header */}
              <div className="h-12 border-b border-stone-200/50 flex items-center justify-between px-6 sm:px-10 text-[11px] font-mono text-stone-400/80">
                <span className="text-stone-400 font-serif">
                  {rightPageIdx < pages.length ? t('pageOf', { current: rightPageIdx + 1, total: pages.length }) : 'Boş Sayfa'}
                </span>
                <span>{new Date().toLocaleDateString(currentLang.locale || 'tr-TR', { day: 'numeric', month: 'short' })}</span>
              </div>

              {/* Editable Text Area */}
              <div className="flex-1 relative w-full pb-16">
                <textarea
                  ref={rightTextareaRef}
                  value={rightPage?.content || ''}
                  onChange={(e) => {
                    // If typing on non-existent page, create it automatically
                    if (rightPageIdx >= pages.length) {
                      onAddPage();
                    }
                    onTextChange(rightPageIdx, e.target.value);
                  }}
                  placeholder={rightPageIdx >= pages.length ? "Yazmaya başlayarak yeni sayfayı açın..." : ""}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full bg-transparent resize-none border-none outline-none focus:ring-0 ${
                    hasMargin ? (isRTL ? 'pr-20 pl-6' : 'pl-20 pr-6') : 'px-8'
                  } ${inkBleed ? 'ink-bleed' : ''} placeholder:text-stone-300/70`}
                  style={fontStyle}
                />
              </div>

              {/* Page corner curl visual cue */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-stone-300/30 to-transparent pointer-events-none"></div>
            </div>
          )}

        </div>

      </div>

      {/* Discreet Bottom Ambient Bar: Quick Controls & Page Flipping */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-4 px-4 text-xs text-stone-500 font-medium">
        
        {/* Left: Zen Focus & Audio Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mürekkep sesini kapat" : "Mürekkep sesini aç"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
              soundEnabled 
                ? 'bg-amber-100/60 border-amber-300/80 text-amber-900' 
                : 'bg-stone-200/50 border-stone-300/60 text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-800" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-mono hidden sm:inline">Mürekkep Sesi</span>
          </button>

          <button
            onClick={onToggleZen}
            title="Zen Odak Modu (Tam Ekran)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-300/60 bg-stone-100 hover:bg-stone-200/70 text-stone-700 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Zen Odak</span>
          </button>
        </div>

        {/* Center/Right: Page Flipping */}
        <div className="flex items-center gap-2 bg-[#fcfaf5] border border-stone-300/70 px-3 py-1 rounded-xl shadow-xs">
          <button
            onClick={onPrevPage}
            disabled={activePageIndex <= 0}
            className="p-1 text-stone-600 hover:bg-stone-200/60 rounded disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Önceki Sayfa"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-serif text-stone-700 px-2 font-semibold">
            {isSpread 
              ? `${leftPageIdx + 1}-${Math.min(rightPageIdx + 1, pages.length)} / ${pages.length}` 
              : `${activePageIndex + 1} / ${pages.length}`}
          </span>

          <button
            onClick={onNextPage}
            disabled={activePageIndex >= pages.length - 1}
            className="p-1 text-stone-600 hover:bg-stone-200/60 rounded disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Sonraki Sayfa"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="w-px h-3.5 bg-stone-300 mx-1"></span>

          <button
            onClick={onAddPage}
            className="flex items-center gap-1 px-2 py-0.5 text-xs text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md font-semibold transition-all"
            title="Yeni Sayfa Ekle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Sayfa</span>
          </button>
        </div>

      </div>

    </div>
  );
}
