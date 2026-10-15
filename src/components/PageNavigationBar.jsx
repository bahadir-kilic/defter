import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  FileText, 
  SplitSquareVertical,
  BookOpen
} from 'lucide-react';

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
  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-1">
      
      {/* Overfill alert badge (Auto page creation helper) */}
      {isPageOverfilled && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl text-xs shadow-xs animate-pulse">
          <SplitSquareVertical className="w-4 h-4 text-amber-800" />
          <span>Bu sayfa doldu. Kalan yazıyı yeni bir sayfaya aktarmak ister misiniz?</span>
          <button
            onClick={onAutoSplitPage}
            className="px-2 py-0.5 bg-amber-800 text-white font-semibold rounded text-[11px] hover:bg-amber-900 transition-all shadow-xs"
          >
            Otomatik Yeni Sayfa Aç
          </button>
        </div>
      )}

      {/* Main Page Flipping Controls */}
      <div className="flex items-center gap-2 bg-[#fbf9f4] border border-[#e6dfd1] px-3 py-1.5 rounded-xl shadow-xs ml-auto">
        
        {/* Previous Page */}
        <button
          onClick={onPrevPage}
          disabled={currentPageIndex <= 0}
          title="Önceki Sayfa (Sol Ok)"
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-serif font-bold text-stone-700 bg-stone-100/80 rounded-md border border-stone-200">
          <BookOpen className="w-3.5 h-3.5 text-amber-800" />
          <span>Sayfa {currentPageIndex + 1} / {totalPages}</span>
        </div>

        {/* Next Page */}
        <button
          onClick={onNextPage}
          disabled={currentPageIndex >= totalPages - 1}
          title="Sonraki Sayfa (Sağ Ok)"
          className="p-1 rounded-lg text-stone-600 hover:bg-stone-200/70 disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <span className="w-px h-4 bg-stone-300 mx-1"></span>

        {/* Add Page Button */}
        <button
          onClick={onAddPage}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-950 bg-amber-200/70 hover:bg-amber-200 rounded-lg transition-all active:scale-95 border border-amber-300"
          title="Yeni boş sayfa ekle"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Sayfa</span>
        </button>

        {/* Delete Page Button */}
        {totalPages > 1 && (
          <button
            onClick={onDeletePage}
            className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Mevcut Sayfayı Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

      </div>
    </div>
  );
}
