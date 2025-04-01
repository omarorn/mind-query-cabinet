
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DualTextProps {
  textKey: string;
  className?: string;
}

const DualText: React.FC<DualTextProps> = ({ textKey, className = '' }) => {
  const { t } = useLanguage();
  const { en, is } = t(textKey);

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <div className="text-left">{en}</div>
      <div className="text-left">{is}</div>
    </div>
  );
};

export default DualText;
