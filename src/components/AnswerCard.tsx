
import { ThumbsUp, CheckCircle2, Brain } from "lucide-react";
import { useState } from "react";
import { Answer } from "@/types/qa";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import DualText from "./DualText";
import { Button } from "./ui/button";

interface AnswerCardProps {
  answer: Answer;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  const { voteAnswer, user, hasContributed, dailyVotesRemaining } = useQA();
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [showFactCheck, setShowFactCheck] = useState(false);
  const [showKidsVersion, setShowKidsVersion] = useState(false);
  
  const formattedDate = new Date(answer.createdAt).toLocaleDateString();
  
  const handleVote = () => {
    if (!user) return;
    voteAnswer(answer.id, 'up');
  };

  // Use punchline if available, otherwise generate one from content
  const punchline = answer.punchline || 
    (answer.content.length > 50 ? `${answer.content.substring(0, 50)}...` : answer.content);
  
  // Display punchline or full content based on expanded state
  const displayContent = expanded ? answer.content : punchline;
  
  return (
    <div className="qa-card">
      <div className="flex items-start gap-4">
        {hasContributed && (
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleVote}
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
              {answer.upvotes}
            </span>
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-gray-700 mb-3">{displayContent}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {answer.content.length > 50 && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-qa-primary" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? t("showLess").is : t("readMore").is}
              </Button>
            )}
            
            {answer.factCheck && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
                onClick={() => setShowFactCheck(!showFactCheck)}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {showFactCheck ? "Hide Fact Check" : "Show Fact Check"}
              </Button>
            )}
            
            {answer.simplifiedQuestion && answer.simplifiedAnswer && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
                onClick={() => setShowKidsVersion(!showKidsVersion)}
              >
                <Brain className="h-3.5 w-3.5" />
                {showKidsVersion ? "Hide Kids Version" : "Show Kids Version"}
              </Button>
            )}
          </div>
          
          {showFactCheck && answer.factCheck && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
              <h4 className="text-sm font-medium text-green-800 mb-1">Fact Check</h4>
              <p className="text-sm text-green-700">{answer.factCheck}</p>
            </div>
          )}
          
          {showKidsVersion && answer.simplifiedQuestion && answer.simplifiedAnswer && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">For Children (7 years old)</h4>
              <p className="text-sm font-medium text-blue-700 mb-1">{answer.simplifiedQuestion}</p>
              <p className="text-sm text-blue-700">{answer.simplifiedAnswer}</p>
            </div>
          )}
          
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
