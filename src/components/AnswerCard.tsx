
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Answer } from "@/types/qa";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import DualText from "./DualText";

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const { voteAnswer, user, hasContributed, dailyVotesRemaining } = useQA();
  const { t } = useLanguage();
  
  const formattedDate = new Date(answer.createdAt).toLocaleDateString();
  
  const handleVote = (voteType: 'up' | 'down') => {
    if (!user) return;
    voteAnswer(answer.id, voteType);
  };
  
  return (
    <div className="qa-card">
      <div className="flex items-start gap-4">
        {hasContributed && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={() => handleVote('up')}
              disabled={!user || (dailyVotesRemaining <= 0 && answer.userVote !== 'up')}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                answer.userVote === 'up' && "text-qa-primary",
                dailyVotesRemaining <= 0 && answer.userVote !== 'up' && "opacity-50 cursor-not-allowed"
              )}
              title={dailyVotesRemaining <= 0 && answer.userVote !== 'up' ? t("noVotesRemaining").en : ""}
            >
              <ThumbsUp size={18} />
            </button>
            <span className="text-sm font-medium">
              {answer.upvotes - answer.downvotes}
            </span>
            <button
              onClick={() => handleVote('down')}
              disabled={!user}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                answer.userVote === 'down' && "text-qa-secondary"
              )}
            >
              <ThumbsDown size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-gray-700 mb-3">{answer.content}</p>
          <div className="text-sm text-gray-500">
            <div className="grid grid-cols-2 gap-2">
              <div>
                {t("answeredBy").en} <span className="font-medium">{answer.authorName}</span> {t("on").en} {formattedDate}
              </div>
              <div>
                {t("answeredBy").is} <span className="font-medium">{answer.authorName}</span> {t("on").is} {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
