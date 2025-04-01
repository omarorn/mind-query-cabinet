
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DualText from '@/components/DualText';
import AutomagicAnswer from '@/components/AutomagicAnswer';
import { useLanguage } from '@/context/LanguageContext';

interface AnswerFormProps {
  questions: Array<{ id: string; title: string }>;
  selectedQuestionId: string;
  answerContent: string;
  magicMode: boolean;
  onQuestionSelect: (questionId: string) => void;
  onAnswerChange: (content: string) => void;
  onGenerateAnswer: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AnswerForm: React.FC<AnswerFormProps> = ({
  questions,
  selectedQuestionId,
  answerContent,
  magicMode,
  onQuestionSelect,
  onAnswerChange,
  onGenerateAnswer,
  onSubmit
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="questionSelect" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="selectQuestion" />
        </label>
        <select
          id="questionSelect"
          value={selectedQuestionId}
          onChange={(e) => onQuestionSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qa-primary"
          required
        >
          <option value="">{t("selectQuestionPlaceholder").en}</option>
          {questions.map(question => (
            <option key={question.id} value={question.id}>
              {question.title}
            </option>
          ))}
        </select>
      </div>
      
      {magicMode && selectedQuestionId && (
        <div className="mb-4">
          <AutomagicAnswer onGenerate={onGenerateAnswer} />
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="answerContent" className="block text-sm font-medium text-gray-700 mb-1">
          <DualText textKey="yourAnswer" />
        </label>
        <Textarea
          id="answerContent"
          value={answerContent}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={t("yourAnswerPlaceholder").en}
          rows={5}
          required
        />
      </div>
      
      <Button type="submit" className="w-full">
        <DualText textKey="submitAnswer" />
      </Button>
    </form>
  );
};

export default AnswerForm;
