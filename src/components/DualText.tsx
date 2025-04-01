
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
  const icelandicText = translations.is === textKey && fallback ? fallback : translations.is;

  // Only show Icelandic text
  return (
    <span className={className}>
      {icelandicText}
    </span>
  );
};

export default DualText;
