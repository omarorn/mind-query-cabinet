
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DualTextProps {
  textKey: string;
  fallback?: string;
  className?: string;
}

const DualText: React.FC<DualTextProps> = ({ textKey, fallback, className = '' }) => {
  const { t } = useLanguage();
  const translations = t(textKey);
  
  // If translations don't exist and a fallback is provided, create a temporary translation
  const { is } = translations.en === textKey && fallback ? 
    { en: fallback, is: fallback } : 
    translations;

  // Only show Icelandic text now
  return (
    <span className={className}>
      <span className="text-left">{is}</span>
    </span>
  );
};

export default DualText;
