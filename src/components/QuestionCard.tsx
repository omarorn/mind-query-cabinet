
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Question } from "@/types/qa";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import DualText from "./DualText";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { voteQuestion, user, hasContributed } = useQA();
  const { t } = useLanguage();
  
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  const handleVote = (voteType: 'up' | 'down') => {
    if (!user) return;
    voteQuestion(question.id, voteType);
  };
  
  return (
    <div className="qa-card">
      <div className="flex items-start gap-4">
        {hasContributed && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => handleVote('up')}
              disabled={!user}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                question.userVote === 'up' && "text-qa-primary"
              )}
            >
              <ThumbsUp size={18} />
            </button>
            <span className="text-sm font-medium">
              {question.upvotes - question.downvotes}
            </span>
            <button
              onClick={() => handleVote('down')}
              disabled={!user}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                question.userVote === 'down' && "text-qa-secondary"
              )}
            >
              <ThumbsDown size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">
            <Link to={`/question/${question.id}`} className="hover:text-qa-primary">
              {question.title}
            </Link>
          </h3>
          <p className="text-gray-600 line-clamp-2 mb-3">{question.content}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  {t("askedBy").en} <span className="font-medium">{question.authorName}</span> {t("on").en} {formattedDate}
                </div>
                <div>
                  {t("askedBy").is} <span className="font-medium">{question.authorName}</span> {t("on").is} {formattedDate}
                </div>
              </div>
            </div>
            <Link to={`/question/${question.id}`} className="text-qa-primary hover:underline">
              <DualText textKey="viewDetails" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
