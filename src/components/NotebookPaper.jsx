import React, { useRef, useEffect } from 'react';
import { HANDWRITING_FONTS } from '../constants/fonts';
import { PAPER_STYLES } from '../constants/colors';
import { COVER_STYLES } from '../constants/notebooks';
import { useTranslation } from '../i18n/LanguageContext';

export function NotebookPaper({
  text,
  onChange,
  fontId,
  fontSize,
  inkColor,
  paperId,
  coverId,
  inkOpacity,
  inkBleed,
  notebookTitle,
  pageIndex,
  totalPages,
  onOverflowDetected,
  clonedProfile
}) {
  const textareaRef = useRef(null);
  const { t, currentLang } = useTranslation();
  const isRTL = currentLang.dir === 'rtl';

  const isCloned = fontId === 'cloned-personal-font';
  const selectedFont = isCloned 
    ? { id: 'cloned', name: t('clonedFontActive'), fontFamily: "'Caveat', cursive" }
    : (HANDWRITING_FONTS.find(f => f.id === fontId) || HANDWRITING_FONTS[0]);
  const selectedPaper = PAPER_STYLES.find(p => p.id === paperId) || PAPER_STYLES[0];
  const selectedCover = COVER_STYLES.find(c => c.id === coverId) || COVER_STYLES[0];

  // Dynamic baseline line-height
  const calculatedLineHeight = Math.max(34, Math.round(fontSize * 1.55));

  // Determine left/right padding based on margin line & spine type
  const isSpiral = selectedCover.spineType === 'spiral';
  const hasMarginLine = paperId === 'ruled' || paperId === 'legal';
  
  let horizontalPaddingClass = isRTL 
    ? (hasMarginLine ? 'pr-20 sm:pr-24 pl-6 sm:pl-10' : 'px-6 sm:px-10')
    : (isSpiral 
        ? (hasMarginLine ? 'pl-24 sm:pl-28 pr-6 sm:pr-10' : 'pl-16 sm:pl-20 pr-6 sm:pr-10')
        : (hasMarginLine ? 'pl-20 sm:pl-24 pr-6 sm:pr-10' : 'px-6 sm:px-10'));

  // Adjust textarea height and detect page overflow
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const targetHeight = Math.max(scrollHeight, 680);
      textareaRef.current.style.height = `${targetHeight}px`;

      if (scrollHeight > 920 && onOverflowDetected) {
        onOverflowDetected(true);
      } else if (onOverflowDetected) {
        onOverflowDetected(false);
      }
    }
  }, [text, fontSize, calculatedLineHeight, onOverflowDetected]);

  return (
    <div className="w-full flex justify-center py-4 sm:py-8 px-2 sm:px-4">
      
      {/* Outer Notebook Casing */}
      <div 
        className="w-full max-w-4xl relative transition-all duration-300"
        style={{
          '--line-height': `${calculatedLineHeight}px`
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        
        {/* Physical Notebook Cover Backing */}
        <div className={`absolute inset-0 -m-3 sm:-m-4 rounded-3xl ${selectedCover.bgClass} ${selectedCover.textureClass} -z-20 transition-all`}>
          {selectedCover.spineType === 'leather' && (
            <div className="absolute inset-1.5 rounded-3xl border border-dashed border-amber-600/30 pointer-events-none"></div>
          )}
        </div>

        {/* Tactile Page Stacking Shadow */}
        <div className="absolute inset-0 bg-[#e7e1d4] translate-y-2 translate-x-1 rounded-2xl -z-10 shadow-md"></div>
        <div className="absolute inset-0 bg-[#eee8db] translate-y-1 translate-x-0.5 rounded-2xl -z-10 shadow-sm"></div>

        {/* Spiral Binder Rings (if spiral cover selected) */}
        {isSpiral && !isRTL && (
          <div className="absolute left-2 sm:left-3 top-6 bottom-6 flex flex-col justify-between z-20 pointer-events-none select-none">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="flex items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 shadow-inner -mr-1.5"></div>
                <div className="w-7 h-3 rounded-full bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 border border-stone-500 shadow-md transform -rotate-6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Vintage Bookmark Ribbon */}
        {selectedCover.spineType === 'ribbon' && (
          <div className={`absolute ${isRTL ? 'left-12' : 'right-12'} -top-4 w-5 h-28 bg-rose-800 shadow-md rounded-b-sm -z-5 pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:border-solid after:border-b-8 after:border-b-transparent after:border-x-[10px] after:border-x-rose-800`}></div>
        )}

        {/* The Paper Sheet */}
        <div 
          className={`relative w-full rounded-2xl shadow-xl border border-stone-300/70 overflow-hidden paper-grain ${selectedPaper.className}`}
          style={{
            minHeight: '740px'
          }}
        >
          {/* Top Notebook Header / Date & Page Title */}
          <div className="w-full h-12 border-b border-stone-200/50 flex items-center justify-between px-6 sm:px-10 text-xs font-mono text-stone-400 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-800/40"></span>
              <span className="tracking-wider uppercase text-[10px] font-bold text-stone-500">
                {notebookTitle}
              </span>
            </div>
            <div className="flex items-center gap-4 text-stone-500 text-[11px]">
              <span>{t('pageOf', { current: pageIndex + 1, total: totalPages })}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString(currentLang.locale || 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Typing Area */}
          <div className="relative w-full pt-4 pb-20">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t('placeholderNotebook')}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`w-full bg-transparent resize-none border-none outline-none focus:ring-0 ${horizontalPaddingClass} ${
                inkBleed ? 'ink-bleed' : ''
              } placeholder:text-stone-300/80 transition-[color,font-size,opacity] ${isRTL ? 'text-right' : 'text-left'}`}
              style={{
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
                overflow: 'hidden'
              }}
            />
          </div>

          {/* Bottom Notebook Footprint */}
          <div className={`absolute bottom-3 ${isRTL ? 'left-6' : 'right-6'} text-[11px] font-serif text-stone-400/60 pointer-events-none select-none italic`}>
            Scriptor • {selectedFont.name}
          </div>

        </div>

      </div>

    </div>
  );
}
