import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  SplitSquareVertical,
  BookOpen
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export function PageNavigationBar({
  currentPageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  onAddPage,
  onDeletePage,
  onAutoSplitPage,
  isPageOverfilled
}) {
  const { t, currentLang } = useTranslation();
  const isRTL = currentLang.dir === 'rtl';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-1">
      
      {/* Overfill alert badge */}
      {isPageOverfilled && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl text-xs shadow-xs animate-pulse">
          <SplitSquareVertical className="w-4 h-4 text-amber-800" />
          <span>{t('pageOverfilled')}</span>
          <button
            onClick={onAutoSplitPage}
            className="px-2 py-0.5 bg-amber-800 text-white font-semibold rounded text-[11px] hover:bg-amber-900 transition-all shadow-xs"
          >
            {t('autoNewPage')}
          </button>
        </div>
      )}

      {/* Main Page Flipping Controls */}
      <div className="flex items-center gap-2 bg-[#fbf9f4] border border-[#e6dfd1] px-3 py-1.5 rounded-xl shadow-xs ml-auto">
        
        {/* Previous Page */}
        <button
          onClick={isRTL ? onNextPage : onPrevPage}
          disabled={isRTL ? (currentPageIndex >= totalPages - 1) : (currentPageIndex <= 0)}
          title="Previous Page"
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Page Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-serif font-bold text-stone-700 bg-stone-100/80 rounded-md border border-stone-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
          <span>{t('pageOf', { current: currentPageIndex + 1, total: totalPages })}</span>
        </div>

        {/* Next Page */}
        <button
          onClick={isRTL ? onPrevPage : onNextPage}
          disabled={isRTL ? (currentPageIndex <= 0) : (currentPageIndex >= totalPages - 1)}
          title="Next Page"
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <span className="w-px h-4 bg-stone-300 mx-1"></span>

        {/* Add Page Button */}
        <button
          onClick={onAddPage}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-950 bg-amber-200/70 hover:bg-amber-200 rounded-lg transition-all active:scale-95 border border-amber-300"
          title={t('newPage')}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('newPage')}</span>
        </button>

        {/* Delete Page Button */}
        {totalPages > 1 && (
          <button
            onClick={onDeletePage}
            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title={t('deletePage')}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
