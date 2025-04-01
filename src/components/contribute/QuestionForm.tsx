
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import DualText from '@/components/DualText';
import AttachmentInput from '@/components/AttachmentInput';
import { useLanguage } from '@/context/LanguageContext';
import { QuestionCategory } from '@/types/qa';
import { Sparkles } from 'lucide-react';

interface QuestionFormProps {
  questionTitle: string;
  questionContent: string;
  questionArticle: string;
  onQuestionTitleChange: (value: string) => void;
  onQuestionContentChange: (value: string) => void;
  onQuestionArticleChange: (value: string) => void;
  onAttachmentChange: (attachment: {
    type: 'file' | 'video' | 'link';
    url: string;
    name?: string;
  } | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  questionSource?: string;
  questionImageUrl?: string;
  questionCategory?: string;
  onQuestionSourceChange?: (value: string) => void;
  onQuestionImageUrlChange?: (value: string) => void;
  onQuestionCategoryChange?: (value: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionTitle,
  questionContent,
  questionArticle,
  onQuestionTitleChange,
  onQuestionContentChange,
  onQuestionArticleChange,
  onAttachmentChange,
  onSubmit,
  questionSource = "",
  questionImageUrl = "",
  questionCategory = "",
  onQuestionSourceChange = () => {},
  onQuestionImageUrlChange = () => {},
  onQuestionCategoryChange = () => {}
}) => {
  const { t } = useLanguage();
  const [easterEggFound, setEasterEggFound] = useState(false);
  
  const categories: QuestionCategory[] = [
    'science',
    'history',
    'technology',
    'culture',
    'education',
    'nature',
    'sports',
    'entertainment',
    'food',
    'travel',
    'business',
    'health',
    'arts',
    'language',
    'surprise'
  ];
  
  const handleContentChange = (value: string) => {
    onQuestionContentChange(value);
    
    // Easter egg: detect if user types "easter egg" in their question
    if (value.toLowerCase().includes("easter egg") && !easterEggFound) {
      setEasterEggFound(true);
      // Show a fun animation or message
      const audio = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      audio.volume = 0.2;
      audio.play().catch(err => console.log("Audio couldn't play: ", err));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="questionTitle" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="questionTitle" />
        </label>
        <Input
          id="questionTitle"
          value={questionTitle}
          onChange={(e) => onQuestionTitleChange(e.target.value)}
          placeholder={t("questionTitlePlaceholder").en}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="questionContent" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="questionDetails" />
        </label>
        <Textarea
          id="questionContent"
          value={questionContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={t("questionDetailsPlaceholder").en}
          rows={5}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="questionCategory" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="category" />
        </label>
        <Select
          value={questionCategory}
          onValueChange={onQuestionCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'surprise' ? (
                    <div className="flex items-center">
                      <span>{category}</span>
                      <Sparkles className="ml-2 h-4 w-4 text-pink-500" />
                    </div>
                  ) : (
                    category
                  )}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <label htmlFor="questionArticle" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="articleFacts" />
        </label>
        <Textarea
          id="questionArticle"
          value={questionArticle}
          onChange={(e) => onQuestionArticleChange(e.target.value)}
          placeholder={t("articleFactsPlaceholder").en}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          <DualText textKey="articleFactsHelp" />
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="questionSource" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="sourceLink" />
        </label>
        <Input
          id="questionSource"
          value={questionSource}
          onChange={(e) => onQuestionSourceChange(e.target.value)}
          placeholder="https://example.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          <DualText textKey="sourceLinkHelp" />
        </p>
      </div>
      
      <div className="mb-4">
        <label htmlFor="questionImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="imageUrl" />
        </label>
        <Input
          id="questionImageUrl"
          value={questionImageUrl}
          onChange={(e) => onQuestionImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          <DualText textKey="imageUrlHelp" />
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="attachments" />
        </label>
        <AttachmentInput 
          onAttachmentChange={onAttachmentChange} 
        />
      </div>
      
      <Button type="submit" className="w-full">
        <DualText textKey="submitQuestion" />
      </Button>
      
      {easterEggFound && (
        <div className="mt-4 p-3 border border-pink-300 bg-pink-50 rounded-md text-pink-800 text-sm animate-bounce">
          You found an Easter egg! 🎉 Your question will get special treatment.
        </div>
      )}
    </form>
  );
};

export default QuestionForm;
