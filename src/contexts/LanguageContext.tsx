import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "te" | "hi" | "mr" | "kn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("preferred_language") as Language) || "en"
  );

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferred_language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
