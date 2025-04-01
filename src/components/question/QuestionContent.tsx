
import { Question } from "@/types/qa";
import { ThumbsUp, File, FileVideo, Link, ExternalLink } from "lucide-react";
import { useQA } from "@/context/QAContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import DualText from "@/components/DualText";

interface QuestionContentProps {
  question: Question;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ question }) => {
  const { user, voteQuestion } = useQA();
  const { t } = useLanguage();
  const formattedDate = new Date(question.createdAt).toLocaleDateString();
  
  const handleVote = () => {
    if (!user) return;
    voteQuestion(question.id, 'up');
  };
  
  const renderAttachment = () => {
    if (!question.attachment) return null;
    
    const { type, url, name } = question.attachment;
    const displayName = name || url;
    
    return (
      <div className="mt-4 p-3 bg-gray-50 border rounded-md">
        <div className="flex items-center mb-2">
          {type === 'file' && <File className="h-5 w-5 mr-2 text-blue-500" />}
          {type === 'video' && <FileVideo className="h-5 w-5 mr-2 text-red-500" />}
          {type === 'link' && <Link className="h-5 w-5 mr-2 text-green-500" />}
          <span className="font-medium">
            <DualText textKey={type === 'file' ? "fileAttachment" : type === 'video' ? "videoAttachment" : "linkAttachment"} />
          </span>
        </div>
        
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-qa-primary hover:underline"
        >
          <span className="truncate">{displayName}</span>
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </div>
    );
  };

  return (
    <div className="qa-card mb-8">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={handleVote}
            disabled={!user}
            className={cn(
              "p-1 rounded hover:bg-gray-100 transition-colors", 
              question.userVote === 'up' && "text-qa-primary"
            )}
          >
            <ThumbsUp size={20} />
          </button>
          <span className="text-lg font-medium">
            {question.upvotes}
          </span>
        </div>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-3">{question.title}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{question.content}</p>
          
          {renderAttachment()}
          
          {question.article && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold mb-2 text-blue-800">
                <DualText textKey="articleFacts" />
              </h3>
              <p className="text-gray-800 whitespace-pre-line">{question.article}</p>
            </div>
          )}
          
          <div className="text-sm text-gray-500 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                {t("askedBy").en} <span className="font-medium">{question.authorName}</span> {t("on").en} {formattedDate}
              </div>
              <div>
                {t("askedBy").is} <span className="font-medium">{question.authorName}</span> {t("on").is} {formattedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionContent;
