
import { Link } from "react-router-dom";
import { ThumbsUp, File, FileVideo, Link as LinkIcon } from "lucide-react";
import { Question } from "@/types/qa";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import DualText from "./DualText";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { voteQuestion, user, hasContributed, dailyVotesRemaining } = useQA();
  const { t } = useLanguage();
  
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  const handleVote = () => {
    if (!user) return;
    voteQuestion(question.id, 'up');
  };
  
  const renderAttachmentIcon = () => {
    if (!question.attachment) return null;
    
    switch (question.attachment.type) {
      case 'file':
        return <File className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-4 w-4 text-red-500" />;
      case 'link':
        return <LinkIcon className="h-4 w-4 text-green-500" />;
    }
  };
  
  return (
    <div className="qa-card">
      <div className="flex items-start gap-4">
        {hasContributed && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleVote}
              disabled={!user || (dailyVotesRemaining <= 0 && question.userVote !== 'up')}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                question.userVote === 'up' && "text-qa-primary",
                dailyVotesRemaining <= 0 && question.userVote !== 'up' && "opacity-50 cursor-not-allowed"
              )}
              title={dailyVotesRemaining <= 0 && question.userVote !== 'up' ? t("noVotesRemaining").en : ""}
            >
              <ThumbsUp size={18} />
            </button>
            <span className="text-sm font-medium">
              {question.upvotes}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">
              <Link to={`/question/${question.id}`} className="hover:text-qa-primary">
                {question.title}
              </Link>
            </h3>
            {renderAttachmentIcon()}
            {question.article && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Article</span>}
          </div>
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
