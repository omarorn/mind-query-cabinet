
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, FileText, Link as LinkIcon, Image } from "lucide-react";
import { formatDistance } from "date-fns";
import { useQA } from "@/context/QAContext";
import { Question } from "@/types/qa";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { voteQuestion, dailyVotesRemaining } = useQA();
  
  const handleVote = () => {
    voteQuestion(question.id, "up");
  };
  
  const hasVoted = !!question.userVote;
  const formattedDate = formatDistance(new Date(question.createdAt), new Date(), { addSuffix: true });
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          <Link to={`/question/${question.id}`} className="text-qa-text hover:text-qa-primary">
            {question.title}
          </Link>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 mb-1">
          {question.content.length > 200
            ? `${question.content.substring(0, 200)}...`
            : question.content}
        </p>
        
        {question.imageUrl && (
          <div className="my-2">
            <img 
              src={question.imageUrl} 
              alt={question.title} 
              className="rounded-md max-h-40 w-auto object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-wrap mt-3 gap-2">
          {question.article && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
              <FileText className="w-3 h-3 mr-1" />
              Article Facts
            </div>
          )}
          
          {question.source && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
              <LinkIcon className="w-3 h-3 mr-1" />
              <a 
                href={question.source.startsWith('http') ? question.source : `https://${question.source}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Source
              </a>
            </div>
          )}
          
          {question.imageUrl && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
              <Image className="w-3 h-3 mr-1" />
              Has Image
            </div>
          )}
          
          {question.attachment && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
              {question.attachment.type === 'file' && <FileText className="w-3 h-3 mr-1" />}
              {question.attachment.type === 'video' && <FileText className="w-3 h-3 mr-1" />}
              {question.attachment.type === 'link' && <LinkIcon className="w-3 h-3 mr-1" />}
              {question.attachment.name || question.attachment.type}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          <span>{question.authorName}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
        
        <Button 
          variant={hasVoted ? "default" : "outline"} 
          size="sm" 
          className="text-xs"
          onClick={handleVote}
          disabled={dailyVotesRemaining <= 0 && !hasVoted}
        >
          <ThumbsUp className="w-3 h-3 mr-1" /> 
          {question.upvotes}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
