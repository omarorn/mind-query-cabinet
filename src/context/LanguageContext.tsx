
import React, { createContext, useContext, ReactNode } from 'react';

// Define the translation structure
type Translations = {
  [key: string]: {
    en: string;
    is: string;
  };
};

// Basic translations
const translations: Translations = {
  // General UI
  appTitle: {
    en: "Q&A Exchange",
    is: "Spurt og svarað"
  },
  home: {
    en: "Home",
    is: "Heim"
  },
  browse: {
    en: "Browse Q&A",
    is: "Skoða spurningar og svör"
  },
  contribute: {
    en: "Contribute",
    is: "Leggja til"
  },
  getStarted: {
    en: "Get Started",
    is: "Byrja"
  },
  viewDetails: {
    en: "View Details",
    is: "Sjá nánar"
  },
  
  // Question related
  questionTitle: {
    en: "Question Title",
    is: "Titill spurningar"
  },
  askQuestion: {
    en: "Ask a Question",
    is: "Spyrja spurningar"
  },
  yourQuestion: {
    en: "Your Question",
    is: "Þín spurning"
  },
  submitQuestion: {
    en: "Submit Question",
    is: "Senda inn spurningu"
  },
  askedBy: {
    en: "Asked by",
    is: "Spurt af"
  },
  on: {
    en: "on",
    is: "þann"
  },
  
  // Answer related
  yourAnswer: {
    en: "Your Answer",
    is: "Þitt svar"
  },
  submitAnswer: {
    en: "Submit Answer",
    is: "Senda inn svar"
  },
  answeredBy: {
    en: "Answered by",
    is: "Svarað af"
  },
  
  // Contribution page
  contributeHeading: {
    en: "Contribute to our Q&A Community",
    is: "Leggðu þitt af mörkum við spurningasamfélagið"
  },
  contributeIntro: {
    en: "Share your knowledge and help others by contributing to our Q&A platform.",
    is: "Deildu þekkingu þinni og hjálpaðu öðrum með því að leggja til við spurningavettvanginn okkar."
  },
  contributeName: {
    en: "Your Name",
    is: "Nafnið þitt"
  },
  pleaseContributeFirst: {
    en: "Please contribute before browsing or asking questions.",
    is: "Vinsamlegast leggðu til áður en þú skoðar eða spyrð spurninga."
  }
};

interface LanguageContextType {
  t: (key: string) => { en: string; is: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const t = (key: string) => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return { en: key, is: key };
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
