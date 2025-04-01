
import React from 'react';
import DualText from '@/components/DualText';
import QuestionForm from './QuestionForm';
import AnswerForm from './AnswerForm';

interface ContributionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  questions: Array<{ id: string; title: string }>;
  questionTitle: string;
  questionContent: string;
  questionArticle: string;
  selectedQuestionId: string;
  answerContent: string;
  magicMode: boolean;
  onQuestionTitleChange: (value: string) => void;
  onQuestionContentChange: (value: string) => void;
  onQuestionArticleChange: (value: string) => void;
  onQuestionSelect: (questionId: string) => void;
  onAnswerChange: (content: string) => void;
  onAttachmentChange: (attachment: {
    type: 'file' | 'video' | 'link';
    url: string;
    name?: string;
  } | null) => void;
  onGenerateAnswer: () => void;
  onQuestionSubmit: (e: React.FormEvent) => void;
  onAnswerSubmit: (e: React.FormEvent) => void;
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
  onAnswerSubmit
}) => {
  return (
    <div className="qa-card">
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "question" 
              ? "border-b-2 border-qa-primary text-qa-primary" 
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("question")}
        >
          <DualText textKey="askQuestion" />
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "answer" 
              ? "border-b-2 border-qa-primary text-qa-primary" 
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("answer")}
        >
          <DualText textKey="answerQuestion" />
        </button>
      </div>
      
      {activeTab === "question" ? (
        <QuestionForm
          questionTitle={questionTitle}
          questionContent={questionContent}
          questionArticle={questionArticle}
          onQuestionTitleChange={onQuestionTitleChange}
          onQuestionContentChange={onQuestionContentChange}
          onQuestionArticleChange={onQuestionArticleChange}
          onAttachmentChange={onAttachmentChange}
          onSubmit={onQuestionSubmit}
        />
      ) : (
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
      )}
    </div>
  );
};

export default ContributionTabs;
