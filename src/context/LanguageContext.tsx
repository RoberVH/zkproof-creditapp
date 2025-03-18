
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode } from "@/lib/i18n/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    // Check browser language on mount
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es") {
      setLanguage("es");
    }
    
    // Store language preference
    const storedLang = localStorage.getItem("language") as LanguageCode | null;
    if (storedLang && (storedLang === "en" || storedLang === "es")) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
