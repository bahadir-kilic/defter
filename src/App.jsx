import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SettingsBar } from './components/SettingsBar';
import { NotebookPaper } from './components/NotebookPaper';
import { PageNavigationBar } from './components/PageNavigationBar';
import { NotebookManagerModal } from './components/NotebookManagerModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { HandwritingCloneModal } from './components/HandwritingCloneModal';
import { INITIAL_NOTEBOOKS } from './constants/notebooks';
import { HANDWRITING_FONTS } from './constants/fonts';

export default function App() {
  // Load notebooks from localStorage or fallback to INITIAL_NOTEBOOKS
  const [notebooks, setNotebooks] = useState(() => {
    try {
      const saved = localStorage.getItem('scriptor_notebooks_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notebooks:', e);
    }
    return INITIAL_NOTEBOOKS;
  });

  const [activeNotebookId, setActiveNotebookId] = useState(() => {
    return localStorage.getItem('scriptor_active_nb_id') || notebooks[0]?.id || 'nb-journal';
  });

  // Cloned Handwriting Profile
  const [clonedProfile, setClonedProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('scriptor_cloned_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cloned profile:', e);
    }
    return null;
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notebooksModalOpen, setNotebooksModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [isPageOverfilled, setIsPageOverfilled] = useState(false);

  // Active Notebook Object
  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId) || notebooks[0];
  const pages = activeNotebook.pages || [{ id: 'p-1', title: 'Sayfa 1', content: '', date: '' }];
  const activePageIndex = Math.min(activeNotebook.activePageIndex || 0, pages.length - 1);
  const currentPage = pages[activePageIndex] || pages[0];

  // Save notebooks to localStorage on every change
  useEffect(() => {
    localStorage.setItem('scriptor_notebooks_v2', JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem('scriptor_active_nb_id', activeNotebookId);
  }, [activeNotebookId]);

  // Update current page text
  const handleTextChange = (newContent) => {
    setNotebooks(prev => prev.map(nb => {
      if (nb.id !== activeNotebookId) return nb;
      const updatedPages = [...nb.pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        content: newContent
      };
      return { ...nb, pages: updatedPages };
    }));
  };

  // Notebook property updates (Font, Size, Color, Paper, Cover)
  const updateActiveNotebook = (updates) => {
    setNotebooks(prev => prev.map(nb => {
      if (nb.id !== activeNotebookId) return nb;
      return { ...nb, ...updates };
    }));
  };

  // Handle applied cloned font
  const handleApplyClonedFont = (profile) => {
    setClonedProfile(profile);
    updateActiveNotebook({ fontId: 'cloned-personal-font' });
  };

  // Page Navigation Handlers
  const handlePrevPage = () => {
    if (activePageIndex > 0) {
      updateActiveNotebook({ activePageIndex: activePageIndex - 1 });
    }
  };

  const handleNextPage = () => {
    if (activePageIndex < pages.length - 1) {
      updateActiveNotebook({ activePageIndex: activePageIndex + 1 });
    }
  };

  const handleAddPage = () => {
    const newPage = {
      id: `p-${Date.now()}`,
      title: `Sayfa ${pages.length + 1}`,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: ''
    };
    const updatedPages = [...pages, newPage];
    updateActiveNotebook({
      pages: updatedPages,
      activePageIndex: updatedPages.length - 1
    });
    setIsPageOverfilled(false);
  };

  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    if (window.confirm('Bu sayfayı silmek istediğinize emin misiniz?')) {
      const updatedPages = pages.filter((_, idx) => idx !== activePageIndex);
      const newIndex = Math.max(0, activePageIndex - 1);
      updateActiveNotebook({
        pages: updatedPages,
        activePageIndex: newIndex
      });
    }
  };

  // Auto split page when content overflows
  const handleAutoSplitPage = () => {
    const content = currentPage.content || '';
    const lines = content.split('\n');
    if (lines.length > 12) {
      const firstHalf = lines.slice(0, 12).join('\n');
      const secondHalf = lines.slice(12).join('\n');

      const updatedPages = [...pages];
      updatedPages[activePageIndex] = {
        ...updatedPages[activePageIndex],
        content: firstHalf
      };

      const newPage = {
        id: `p-${Date.now()}`,
        title: `Sayfa ${pages.length + 1}`,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        content: secondHalf
      };

      updatedPages.splice(activePageIndex + 1, 0, newPage);
      updateActiveNotebook({
        pages: updatedPages,
        activePageIndex: activePageIndex + 1
      });
      setIsPageOverfilled(false);
    } else {
      handleAddPage();
    }
  };

  // Create new notebook
  const handleCreateNotebook = ({ title, subtitle, coverId }) => {
    const newNb = {
      id: `nb-${Date.now()}`,
      title,
      subtitle,
      coverId,
      paperId: activeNotebook.paperId || 'ruled',
      fontId: activeNotebook.fontId || 'caveat',
      fontSize: activeNotebook.fontSize || 26,
      inkColor: activeNotebook.inkColor || '#1d4ed8',
      createdAt: new Date().toISOString(),
      pages: [
        {
          id: `p-${Date.now()}`,
          title: 'İlk Sayfa',
          date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
          content: ''
        }
      ],
      activePageIndex: 0
    };
    setNotebooks(prev => [newNb, ...prev]);
    setActiveNotebookId(newNb.id);
  };

  // Delete notebook
  const handleDeleteNotebook = (idToDelete) => {
    if (notebooks.length <= 1) return;
    const remaining = notebooks.filter(nb => nb.id !== idToDelete);
    setNotebooks(remaining);
    if (activeNotebookId === idToDelete) {
      setActiveNotebookId(remaining[0].id);
    }
  };

  const isClonedActive = activeNotebook.fontId === 'cloned-personal-font';
  const currentFont = isClonedActive
    ? { fontFamily: "'Caveat', cursive", name: 'Kendi El Yazım (Klon)' }
    : (HANDWRITING_FONTS.find(f => f.id === activeNotebook.fontId) || HANDWRITING_FONTS[0]);

  return (
    <div className="min-h-screen bg-[#F3EFE6] flex flex-col font-sans text-stone-800">
      
      {/* Top Header */}
      <Header
        notebookTitle={activeNotebook.title}
        coverId={activeNotebook.coverId || 'leather-brown'}
        onOpenNotebooks={() => setNotebooksModalOpen(true)}
        onOpenAiAssistant={() => setAiModalOpen(true)}
        onOpenCloner={() => setCloneModalOpen(true)}
        hasClonedFont={!!clonedProfile}
        text={currentPage.content || ''}
        onClear={() => {
          if (window.confirm('Bu sayfadaki yazıyı temizlemek istediğinize emin misiniz?')) {
            handleTextChange('');
          }
        }}
        settingsOpen={settingsOpen}
        onToggleSettings={() => setSettingsOpen(!settingsOpen)}
      />

      {/* Settings Bar */}
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

      {/* Page Navigation & Pagination Bar */}
      <PageNavigationBar
        currentPageIndex={activePageIndex}
        totalPages={pages.length}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        onAutoSplitPage={handleAutoSplitPage}
        isPageOverfilled={isPageOverfilled}
      />

      {/* Main Tactile Notebook Surface */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center pb-12">
        <NotebookPaper
          text={currentPage.content || ''}
          onChange={handleTextChange}
          fontId={activeNotebook.fontId || 'caveat'}
          fontSize={activeNotebook.fontSize || 26}
          inkColor={activeNotebook.inkColor || '#1d4ed8'}
          paperId={activeNotebook.paperId || 'ruled'}
          coverId={activeNotebook.coverId || 'leather-brown'}
          inkOpacity={0.95}
          inkBleed={true}
          notebookTitle={activeNotebook.title}
          pageIndex={activePageIndex}
          totalPages={pages.length}
          onOverflowDetected={setIsPageOverfilled}
          clonedProfile={clonedProfile}
        />
      </main>

      {/* Notebook Manager Modal */}
      <NotebookManagerModal
        isOpen={notebooksModalOpen}
        onClose={() => setNotebooksModalOpen(false)}
        notebooks={notebooks}
        activeNotebookId={activeNotebookId}
        onSelectNotebook={setActiveNotebookId}
        onCreateNotebook={handleCreateNotebook}
        onDeleteNotebook={handleDeleteNotebook}
        onUpdateNotebook={updateActiveNotebook}
      />

      {/* AI Handwriting Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        currentText={currentPage.content || ''}
        fontFamily={currentFont.fontFamily}
        inkColor={activeNotebook.inkColor || '#1d4ed8'}
        onApplyText={handleTextChange}
      />

      {/* One-Shot Handwriting Cloner Studio Modal */}
      <HandwritingCloneModal
        isOpen={cloneModalOpen}
        onClose={() => setCloneModalOpen(false)}
        onApplyClonedFont={handleApplyClonedFont}
        existingClonedProfile={clonedProfile}
      />

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-stone-500 border-t border-stone-200/60 mt-auto bg-[#efeae0]/60">
        <p>
          Scriptor (Defter) — Çoklu defterler, bireysel el yazısı klonlama ve edebi AI entegrasyonu. Tüm notlarınız tarayıcınızda güvende.
        </p>
      </footer>
    </div>
  );
}
