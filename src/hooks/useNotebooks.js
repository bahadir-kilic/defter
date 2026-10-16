import { useState, useEffect, useCallback } from 'react';
import { INITIAL_NOTEBOOKS } from '../constants/notebooks';
import { playPenScratch, playPageTurn } from '../services/soundService';

export function useNotebooks() {
  // Load notebooks with safe fallback
  const [notebooks, setNotebooks] = useState(() => {
    try {
      const saved = localStorage.getItem('scriptor_notebooks_v3');
      if (saved) return JSON.parse(saved);
      // Migration from v2
      const v2 = localStorage.getItem('scriptor_notebooks_v2');
      if (v2) return JSON.parse(v2);
    } catch (e) {
      console.error('Error loading notebooks:', e);
    }
    return INITIAL_NOTEBOOKS;
  });

  const [activeNotebookId, setActiveNotebookId] = useState(() => {
    return localStorage.getItem('scriptor_active_nb_id') || notebooks[0]?.id || 'nb-journal';
  });

  // UI preferences
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('scriptor_view_mode') || 'single'; // 'single' | 'spread'
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('scriptor_sound_enabled') !== 'false';
  });

  const [zenMode, setZenMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Active Notebook reference
  const activeNotebook = notebooks.find(nb => nb.id === activeNotebookId) || notebooks[0] || INITIAL_NOTEBOOKS[0];
  const pages = activeNotebook.pages && activeNotebook.pages.length > 0 
    ? activeNotebook.pages 
    : [{ id: 'p-1', title: 'Sayfa 1', content: '', date: '' }];
  const activePageIndex = Math.min(activeNotebook.activePageIndex || 0, pages.length - 1);
  const currentPage = pages[activePageIndex] || pages[0];

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('scriptor_notebooks_v3', JSON.stringify(notebooks));
      setLastSaved(Date.now());
    } catch (e) {
      console.error('Error saving notebooks:', e);
    }
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem('scriptor_active_nb_id', activeNotebookId);
  }, [activeNotebookId]);

  useEffect(() => {
    localStorage.setItem('scriptor_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('scriptor_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Update notebook settings (font, ink, paper, cover)
  const updateActiveNotebook = useCallback((updates) => {
    setNotebooks(prev => prev.map(nb => {
      if (nb.id !== activeNotebookId) return nb;
      return { ...nb, ...updates };
    }));
  }, [activeNotebookId]);

  // Update text of a specific page
  const updatePageContent = useCallback((pageIdx, newContent) => {
    if (soundEnabled) {
      playPenScratch(true);
    }
    setNotebooks(prev => prev.map(nb => {
      if (nb.id !== activeNotebookId) return nb;
      const updatedPages = [...nb.pages];
      if (updatedPages[pageIdx]) {
        updatedPages[pageIdx] = {
          ...updatedPages[pageIdx],
          content: newContent
        };
      }
      return { ...nb, pages: updatedPages };
    }));
  }, [activeNotebookId, soundEnabled]);

  // Update current active page
  const updateCurrentPage = useCallback((newContent) => {
    updatePageContent(activePageIndex, newContent);
  }, [updatePageContent, activePageIndex]);

  // Page navigation
  const prevPage = useCallback(() => {
    if (activePageIndex > 0) {
      if (soundEnabled) playPageTurn(true);
      const step = viewMode === 'spread' ? 2 : 1;
      updateActiveNotebook({ activePageIndex: Math.max(0, activePageIndex - step) });
    }
  }, [activePageIndex, viewMode, soundEnabled, updateActiveNotebook]);

  const nextPage = useCallback(() => {
    if (activePageIndex < pages.length - 1) {
      if (soundEnabled) playPageTurn(true);
      const step = viewMode === 'spread' ? 2 : 1;
      updateActiveNotebook({ activePageIndex: Math.min(pages.length - 1, activePageIndex + step) });
    }
  }, [activePageIndex, pages.length, viewMode, soundEnabled, updateActiveNotebook]);

  const goToPage = useCallback((idx) => {
    if (idx >= 0 && idx < pages.length) {
      if (soundEnabled) playPageTurn(true);
      updateActiveNotebook({ activePageIndex: idx });
    }
  }, [pages.length, soundEnabled, updateActiveNotebook]);

  // Add new blank page
  const addPage = useCallback(() => {
    if (soundEnabled) playPageTurn(true);
    const newPage = {
      id: `p-${Date.now()}`,
      title: `Sayfa ${pages.length + 1}`,
      date: new Date().toLocaleDateString(),
      content: ''
    };
    const updatedPages = [...pages, newPage];
    updateActiveNotebook({
      pages: updatedPages,
      activePageIndex: updatedPages.length - 1
    });
  }, [pages, soundEnabled, updateActiveNotebook]);

  // Delete page
  const deletePage = useCallback((idx = activePageIndex) => {
    if (pages.length <= 1) return;
    const updatedPages = pages.filter((_, i) => i !== idx);
    const newIdx = Math.max(0, Math.min(idx, updatedPages.length - 1));
    updateActiveNotebook({
      pages: updatedPages,
      activePageIndex: newIdx
    });
  }, [pages, activePageIndex, updateActiveNotebook]);

  // Create new notebook
  const createNotebook = useCallback(({ title, subtitle, coverId }) => {
    const newNb = {
      id: `nb-${Date.now()}`,
      title,
      subtitle: subtitle || 'Scriptor Notebook',
      coverId: coverId || 'leather-brown',
      paperId: activeNotebook.paperId || 'ruled',
      fontId: activeNotebook.fontId || 'caveat',
      fontSize: activeNotebook.fontSize || 26,
      inkColor: activeNotebook.inkColor || '#1d4ed8',
      createdAt: new Date().toISOString(),
      pages: [
        {
          id: `p-${Date.now()}`,
          title: 'Sayfa 1',
          date: new Date().toLocaleDateString(),
          content: ''
        }
      ],
      activePageIndex: 0
    };
    setNotebooks(prev => [newNb, ...prev]);
    setActiveNotebookId(newNb.id);
  }, [activeNotebook]);

  // Delete notebook
  const deleteNotebook = useCallback((idToDelete) => {
    if (notebooks.length <= 1) return;
    const remaining = notebooks.filter(nb => nb.id !== idToDelete);
    setNotebooks(remaining);
    if (activeNotebookId === idToDelete) {
      setActiveNotebookId(remaining[0].id);
    }
  }, [notebooks, activeNotebookId]);

  return {
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
    updateCurrentPage,
    updatePageContent,
    prevPage,
    nextPage,
    goToPage,
    addPage,
    deletePage,
    createNotebook,
    deleteNotebook
  };
}
