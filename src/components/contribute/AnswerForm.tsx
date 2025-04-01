
import React, { useState } from 'react';
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
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onAnswerChange(value);
    setCharCount(value.length);
  };

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
          <option value="">{t("selectQuestionPlaceholder").is}</option>
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
          onChange={handleTextChange}
          placeholder={t("yourAnswerPlaceholder").is}
          rows={5}
          required
        />
        <div className="mt-2 flex justify-between text-sm text-gray-500">
          <div>
            <span className={charCount > 0 ? "font-medium" : ""}>
              {charCount} {t("characters").is}
            </span>
          </div>
          {charCount > 50 && (
            <div>
              <span className="font-medium text-amber-600">
                {t("previewNote").is || "Fyrstu 50 stafir verða sýnilegir í forskoðun"}
              </span>
            </div>
          )}
        </div>
        {answerContent && answerContent.length > 50 && (
          <div className="mt-3 p-3 border rounded-md bg-gray-50">
            <p className="text-sm font-medium text-gray-700">{t("preview").is || "Forskoðun"}:</p>
            <p className="text-gray-600 mt-1">{answerContent.substring(0, 50)}...</p>
            <span className="text-xs text-qa-primary mt-1 inline-block">
              {t("clickToExpandPreview").is || "Smella til að skoða meira"}
            </span>
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full">
        <DualText textKey="submitAnswer" />
      </Button>
    </form>
  );
};

export default AnswerForm;
