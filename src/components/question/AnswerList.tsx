
import { Answer } from "@/types/qa";
import { useLanguage } from "@/context/LanguageContext";
import AnswerCard from "@/components/AnswerCard";
import DualText from "@/components/DualText";

interface AnswerListProps {
  answers: Answer[];
}

const AnswerList: React.FC<AnswerListProps> = ({ answers }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {answers.length} <DualText textKey={answers.length === 1 ? "answer" : "answers"} />
      </h2>
      
      {answers.length > 0 ? (
        <div className="space-y-4">
          {answers.map(answer => (
            <AnswerCard key={answer.id} answer={answer} />
          ))}
        </div>
      ) : (
        <div className="qa-card text-center py-8">
          <p className="text-gray-600">
            <DualText textKey="noAnswersYet" />
          </p>
        </div>
      )}
    </div>
  );
};

export default AnswerList;
