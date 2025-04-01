
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DualText from '@/components/DualText';
import AttachmentInput from '@/components/AttachmentInput';
import { useLanguage } from '@/context/LanguageContext';

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
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  questionTitle,
  questionContent,
  questionArticle,
  onQuestionTitleChange,
  onQuestionContentChange,
  onQuestionArticleChange,
  onAttachmentChange,
  onSubmit
}) => {
  const { t } = useLanguage();

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
          onChange={(e) => onQuestionContentChange(e.target.value)}
          placeholder={t("questionDetailsPlaceholder").en}
          rows={5}
          required
        />
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
    </form>
  );
};

export default QuestionForm;
