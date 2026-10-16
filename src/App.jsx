import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsBar } from './components/SettingsBar';
import { NotebookPaper } from './components/NotebookPaper';
import { NotebookManagerModal } from './components/NotebookManagerModal';
import { HandwritingCloneModal } from './components/HandwritingCloneModal';
import { LanguageProvider, useTranslation } from './i18n/LanguageContext';
import { useNotebooks } from './hooks/useNotebooks';
import { Minimize2 } from 'lucide-react';

function ScriptorApp() {
  const { t } = useTranslation();

  const {
    notebooks,
    activeNotebook,
    activeNotebookId,
    setActiveNotebookId,
    pages,
    activePageIndex,
    currentPage,
    viewMode,
    setViewMode,
    soundEnabled,
    setSoundEnabled,
    zenMode,
    setZenMode,
    lastSaved,
    updateActiveNotebook,
    updatePageContent,
    prevPage,
    nextPage,
    addPage,
    deletePage,
    createNotebook,
    deleteNotebook
  } = useNotebooks();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notebooksModalOpen, setNotebooksModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Cloned profile state
  const [clonedProfile, setClonedProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('scriptor_cloned_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const handleApplyClonedFont = (profile) => {
    setClonedProfile(profile);
    updateActiveNotebook({ fontId: 'cloned-personal-font' });
  };

  // Keyboard Shortcuts (Zen, Spread, Page Flip, New Page, Save)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + S
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 2000);
      }
      // Cmd/Ctrl + J: Toggle Zen Focus
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setZenMode(z => !z);
      }
      // Cmd/Ctrl + B: Toggle Spread Mode
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setViewMode(v => v === 'spread' ? 'single' : 'spread');
      }
      // Cmd/Ctrl + N: New Page
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        addPage();
      }
      // Esc: Exit Zen mode
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addPage, setZenMode, setViewMode, zenMode]);

  return (
    <div className="min-h-screen desk-ambient flex flex-col font-sans text-stone-800 transition-colors relative overflow-x-hidden">
      
      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#2A1D15] text-[#FAF7F0] px-4 py-1.5 rounded-full text-xs font-serif shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Tüm satırlar kaydedildi</span>
        </div>
      )}

      {/* Floating Zen Mode Exit Pill */}
      {zenMode && (
        <button
          onClick={() => setZenMode(false)}
          className="fixed top-4 right-4 z-50 bg-stone-900/60 hover:bg-stone-900 text-stone-200 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 backdrop-blur-sm shadow-md transition-all group"
          title="Zen Odak Modundan Çık (Esc)"
        >
          <Minimize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-mono">Zen'den Çık</span>
        </button>
      )}

      {/* Top Header (Fades in/out smoothly in Zen mode) */}
      <div className={`transition-opacity duration-300 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Header
          notebookTitle={activeNotebook.title}
          coverId={activeNotebook.coverId || 'leather-brown'}
          onOpenNotebooks={() => setNotebooksModalOpen(true)}
          onOpenCloner={() => setCloneModalOpen(true)}
          hasClonedFont={!!clonedProfile}
          text={currentPage.content || ''}
          settingsOpen={settingsOpen}
          onToggleSettings={() => setSettingsOpen(!settingsOpen)}
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(v => v === 'spread' ? 'single' : 'spread')}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          onToggleZen={() => setZenMode(z => !z)}
          lastSaved={lastSaved}
        />

        {/* Compact Settings Drawer */}
        {settingsOpen && (
          <SettingsBar
            fontId={activeNotebook.fontId || 'caveat'}
            onFontChange={(newFont) => updateActiveNotebook({ fontId: newFont })}
            fontSize={activeNotebook.fontSize || 26}
            onFontSizeChange={(newSize) => updateActiveNotebook({ fontSize: newSize })}
            inkColor={activeNotebook.inkColor || '#1d4ed8'}
            onInkColorChange={(newColor) => updateActiveNotebook({ inkColor: newColor })}
            paperId={activeNotebook.paperId || 'ruled'}
            onPaperChange={(newPaper) => updateActiveNotebook({ paperId: newPaper })}
            inkOpacity={0.95}
            onInkOpacityChange={() => {}}
            inkBleed={true}
            onInkBleedChange={() => {}}
            clonedProfile={clonedProfile}
            onOpenCloner={() => setCloneModalOpen(true)}
          />
        )}
      </div>

      {/* Main Study Desk & Tactile Notebook Surface */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-2 sm:p-6 transition-all">
        <NotebookPaper
          pages={pages}
          activePageIndex={activePageIndex}
          onPageChange={() => {}}
          onTextChange={updatePageContent}
          fontId={activeNotebook.fontId || 'caveat'}
          fontSize={activeNotebook.fontSize || 26}
          inkColor={activeNotebook.inkColor || '#1d4ed8'}
          paperId={activeNotebook.paperId || 'ruled'}
          coverId={activeNotebook.coverId || 'leather-brown'}
          inkOpacity={0.95}
          inkBleed={true}
          notebookTitle={activeNotebook.title}
          clonedProfile={clonedProfile}
          viewMode={viewMode}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(s => !s)}
          onToggleZen={() => setZenMode(z => !z)}
          onAddPage={addPage}
          onPrevPage={prevPage}
          onNextPage={nextPage}
        />
      </main>

      {/* Minimal Editorial Footer */}
      <footer className={`w-full py-3 text-center text-[11px] font-serif text-stone-500/80 transition-opacity duration-300 ${zenMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <p>Scriptor • Dokunsal Analog Çalışma Alanı</p>
      </footer>

      {/* Notebook Manager Modal */}
      <NotebookManagerModal
        isOpen={notebooksModalOpen}
        onClose={() => setNotebooksModalOpen(false)}
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onSelectNotebook={setActiveNotebookId}
        onCreateNotebook={createNotebook}
        onDeleteNotebook={deleteNotebook}
      />

      {/* One-Shot Handwriting Cloner Studio Modal */}
      <HandwritingCloneModal
        isOpen={cloneModalOpen}
        onClose={() => setCloneModalOpen(false)}
        onApplyClonedFont={handleApplyClonedFont}
        existingClonedProfile={clonedProfile}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ScriptorApp />
    </LanguageProvider>
  );
}
