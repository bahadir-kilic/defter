import React, { useState } from 'react';
import { COVER_STYLES } from '../constants/notebooks';
import { 
  Book, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  FolderPlus,
  Sparkles,
  Palette
} from 'lucide-react';

export function NotebookManagerModal({
  isOpen,
  onClose,
  notebooks,
  activeNotebookId,
  onSelectNotebook,
  onCreateNotebook,
  onDeleteNotebook,
  onUpdateNotebook
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCoverId, setNewCoverId] = useState('leather-brown');

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateNotebook({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Yeni el yazısı defteri',
      coverId: newCoverId
    });

    setNewTitle('');
    setNewSubtitle('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FCFAF5] rounded-2xl shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-100/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-900 text-amber-50 flex items-center justify-center shadow-xs">
              <Book className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800 font-serif">Defterlerim & Kitaplık</h2>
              <p className="text-xs text-stone-500">Tüm el yazısı defterlerinizi yönetin ve yeni ciltler oluşturun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          
          {/* New Notebook Creator Toggle */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 px-4 border-2 border-dashed border-amber-800/30 hover:border-amber-800/70 bg-amber-50/50 hover:bg-amber-50 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold text-amber-900 transition-all group shadow-xs"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Yeni Defter Aç & Cilt Tasarla</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-5 bg-stone-100/80 rounded-xl border border-stone-300/80 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-amber-800" />
                  Yeni Defter Oluştur
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Vazgeç
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Defter Başlığı</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Yaratıcı Fikirler & Roman"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Alt Açıklama (İsteğe Bağlı)</label>
                  <input
                    type="text"
                    placeholder="Örn: Sabah sayfaları ve eskizler"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30 text-stone-800"
                  />
                </div>
              </div>

              {/* Cover Style Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-800" />
                  Kapak & Cilt Tasarımı Seçin
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {COVER_STYLES.map((cover) => (
                    <button
                      type="button"
                      key={cover.id}
                      onClick={() => setNewCoverId(cover.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all relative overflow-hidden ${
                        newCoverId === cover.id
                          ? 'ring-2 ring-amber-800 border-amber-900 bg-white shadow-md'
                          : 'border-stone-200 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className={`w-full h-10 rounded-lg ${cover.bgClass} flex items-center justify-center shadow-inner relative`}>
                        <span className="text-[11px] font-serif font-bold text-white/90 drop-shadow-sm">
                          {cover.category}
                        </span>
                        {newCoverId === cover.id && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-stone-800 truncate">{cover.name}</span>
                      <span className="text-[10px] text-stone-400">{cover.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg transition-all"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  Defteri Oluştur
                </button>
              </div>
            </form>
          )}

          {/* Notebooks Grid */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Mevcut Defterleriniz ({notebooks.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {notebooks.map((nb) => {
                const cover = COVER_STYLES.find(c => c.id === nb.coverId) || COVER_STYLES[0];
                const isActive = nb.id === activeNotebookId;
                const pageCount = nb.pages ? nb.pages.length : 1;

                return (
                  <div
                    key={nb.id}
                    onClick={() => {
                      onSelectNotebook(nb.id);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 relative group ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-800/60 shadow-md ring-2 ring-amber-800/20'
                        : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm'
                    }`}
                  >
                    {/* Visual Book Cover Spine */}
                    <div className={`w-14 h-18 rounded-lg flex-shrink-0 ${cover.bgClass} flex flex-col justify-between p-1.5 shadow-md border-r-2 border-black/20 relative overflow-hidden`}>
                      <div className="w-1.5 h-full absolute left-0 top-0 bg-black/25"></div>
                      <span className="text-[8px] font-mono font-bold text-white/70 uppercase">
                        {cover.spineType}
                      </span>
                      <span className="text-[9px] font-serif font-bold text-amber-200/90 truncate">
                        {nb.title.slice(0, 10)}
                      </span>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-stone-800 truncate font-serif">{nb.title}</h3>
                        {isActive && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 truncate mt-0.5">{nb.subtitle}</p>
                      
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-400">
                        <span>{pageCount} sayfa</span>
                        <span>•</span>
                        <span>{cover.name}</span>
                      </div>
                    </div>

                    {/* Delete Notebook Button (if more than 1 notebook exists) */}
                    {notebooks.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`"${nb.title}" defterini silmek istediğinize emin misiniz?`)) {
                            onDeleteNotebook(nb.id);
                          }
                        }}
                        title="Defteri Sil"
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Defterler ve sayfalar tarayıcınızda otomatik kaydedilir.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 font-medium text-stone-800 rounded-lg transition-all"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
