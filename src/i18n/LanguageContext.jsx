import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES, TRANSLATIONS } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(() => {
    return localStorage.getItem('scriptor_lang') || 'tr';
  });

  const currentLang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];

  const t = (key, params = {}) => {
    let str = TRANSLATIONS[langCode]?.[key] || TRANSLATIONS.tr?.[key] || key;
    if (typeof str === 'string') {
      Object.keys(params).forEach(p => {
        str = str.replace(`{${p}}`, params[p]);
      });
    }
    return str;
  };

  const changeLanguage = (code) => {
    setLangCode(code);
    localStorage.setItem('scriptor_lang', code);
    document.documentElement.lang = code;
    document.documentElement.dir = LANGUAGES.find(l => l.code === code)?.dir || 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = langCode;
    document.documentElement.dir = currentLang.dir;
  }, [langCode, currentLang]);

  return (
    <LanguageContext.Provider value={{ langCode, currentLang, changeLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
