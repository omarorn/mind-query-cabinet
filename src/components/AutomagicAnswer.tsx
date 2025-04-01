
import React from 'react';
import { Button } from '@/components/ui/button';
import { Laugh } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface AutomagicAnswerProps {
  onGenerate: () => void;
}

const AutomagicAnswer: React.FC<AutomagicAnswerProps> = ({ onGenerate }) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      type="button" 
      onClick={onGenerate}
      className="w-full mb-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
    >
      <Laugh className="mr-2 h-4 w-4" />
      <span>{t("generateMagicAnswer").is}</span>
    </Button>
  );
};

export default AutomagicAnswer;
