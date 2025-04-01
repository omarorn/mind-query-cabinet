
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Question } from '@/types/qa';
import { useLanguage } from '@/context/LanguageContext';
import DualText from '@/components/DualText';
import QuestionForm from '@/components/contribute/QuestionForm';
import AnswerForm from '@/components/contribute/AnswerForm';

interface ContributionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  questions: Question[];
  questionTitle: string;
  questionContent: string;
  questionArticle: string;
  selectedQuestionId: string;
  answerContent: string;
  magicMode: boolean;
  onQuestionTitleChange: (value: string) => void;
  onQuestionContentChange: (value: string) => void;
  onQuestionArticleChange: (value: string) => void;
  onQuestionSelect: (id: string) => void;
  onAnswerChange: (value: string) => void;
  onAttachmentChange: (attachment: {
    type: 'file' | 'video' | 'link';
    url: string;
    name?: string;
  } | null) => void;
  onGenerateAnswer: () => void;
  onQuestionSubmit: (e: React.FormEvent) => void;
  onAnswerSubmit: (e: React.FormEvent) => void;
  questionSource?: string;
  questionImageUrl?: string;
  questionCategory?: string;
  onQuestionSourceChange?: (value: string) => void;
  onQuestionImageUrlChange?: (value: string) => void;
  onQuestionCategoryChange?: (value: string) => void;
}

const ContributionTabs: React.FC<ContributionTabsProps> = ({
  activeTab,
  setActiveTab,
  questions,
  questionTitle,
  questionContent,
  questionArticle,
  selectedQuestionId,
  answerContent,
  magicMode,
  onQuestionTitleChange,
  onQuestionContentChange,
  onQuestionArticleChange,
  onQuestionSelect,
  onAnswerChange,
  onAttachmentChange,
  onGenerateAnswer,
  onQuestionSubmit,
  onAnswerSubmit,
  questionSource = "",
  questionImageUrl = "",
  questionCategory = "",
  onQuestionSourceChange = () => {},
  onQuestionImageUrlChange = () => {},
  onQuestionCategoryChange = () => {}
}) => {
  const { t } = useLanguage();
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="question">
          <DualText textKey="askQuestion" />
        </TabsTrigger>
        <TabsTrigger value="answer">
          <DualText textKey="answerQuestion" />
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="question" className="qa-card">
        <h2 className="text-xl font-semibold mb-4">
          <DualText textKey="askQuestionTitle" />
        </h2>
        <QuestionForm
          questionTitle={questionTitle}
          questionContent={questionContent}
          questionArticle={questionArticle}
          onQuestionTitleChange={onQuestionTitleChange}
          onQuestionContentChange={onQuestionContentChange}
          onQuestionArticleChange={onQuestionArticleChange}
          onAttachmentChange={onAttachmentChange}
          onSubmit={onQuestionSubmit}
          questionSource={questionSource}
          questionImageUrl={questionImageUrl}
          questionCategory={questionCategory}
          onQuestionSourceChange={onQuestionSourceChange}
          onQuestionImageUrlChange={onQuestionImageUrlChange}
          onQuestionCategoryChange={onQuestionCategoryChange}
        />
      </TabsContent>
      
      <TabsContent value="answer" className="qa-card">
        <h2 className="text-xl font-semibold mb-4">
          <DualText textKey="answerQuestionTitle" />
        </h2>
        <AnswerForm
          questions={questions}
          selectedQuestionId={selectedQuestionId}
          answerContent={answerContent}
          magicMode={magicMode}
          onQuestionSelect={onQuestionSelect}
          onAnswerChange={onAnswerChange}
          onGenerateAnswer={onGenerateAnswer}
          onSubmit={onAnswerSubmit}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContributionTabs;
