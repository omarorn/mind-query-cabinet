
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Answer } from "@/types/qa";
import { useQA } from "@/context/QAContext";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const { voteAnswer, user, hasContributed } = useQA();
  
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
              disabled={!user}
              className={cn(
                "p-1 rounded hover:bg-gray-100 transition-colors", 
                answer.userVote === 'up' && "text-qa-primary"
              )}
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
            Answered by <span className="font-medium">{answer.authorName}</span> on {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
