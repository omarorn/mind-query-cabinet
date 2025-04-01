
import { Question } from "@/types/qa";
import { useLanguage } from "@/context/LanguageContext";
import CategoryBadge from "./CategoryBadge";
import AttachmentBadge from "./AttachmentBadge";
import QuestionImage from "./QuestionImage";
import { SparkleIcon } from "lucide-react";
import SparkleEffect from "./SparkleEffect";
import SpeechButton from "../SpeechButton";

interface QuestionContentProps {
  question: Question;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ question }) => {
  const { t } = useLanguage();
  const isEasterEgg = question.isEasterEgg;
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  return (
    <div className="qa-card mb-6">
      <div className="relative">
        {isEasterEgg && <SparkleEffect />}
        
        <h1 className={`text-2xl font-bold mb-2 ${isEasterEgg ? 'text-purple-600' : ''}`}>
          {question.title}
          {isEasterEgg && (
            <SparkleIcon className="inline-block ml-2 w-5 h-5 text-yellow-500" />
          )}
        </h1>
        
        <p className="text-gray-700 mb-4">
          {question.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Add Speech button */}
          <SpeechButton text={`${question.title}. ${question.content}`} />
          
          {question.category && (
            <CategoryBadge category={question.category} />
          )}
          
          {question.attachment && (
            <AttachmentBadge 
              type={question.attachment.type}
              url={question.attachment.url}
              name={question.attachment.name}
            />
          )}
        </div>
        
        {question.imageUrl && (
          <QuestionImage 
            src={question.imageUrl} 
            alt={question.title} 
            isEasterEgg={!!isEasterEgg}
            isHovered={false}
          />
        )}
        
        {question.article && (
          <div className="text-gray-700 mb-4">
            {question.article}
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          <div className="grid grid-cols-2 gap-2">
            <div>
              {t("askedBy").en}{" "}
              <span className="font-medium">{question.authorName}</span> {t("on").en} {formattedDate}
            </div>
            <div>
              {t("askedBy").is}{" "}
              <span className="font-medium">{question.authorName}</span> {t("on").is} {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionContent;
