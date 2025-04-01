
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, FileText, Link as LinkIcon, Image, Tag, Sparkles, PartyPopper } from "lucide-react";
import { formatDistance } from "date-fns";
import { useQA } from "@/context/QAContext";
import { Question } from "@/types/qa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  showContent?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, showContent = true }) => {
  const { voteQuestion, dailyVotesRemaining } = useQA();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleVote = () => {
    voteQuestion(question.id, "up");
  };
  
  const hasVoted = !!question.userVote;
  const formattedDate = formatDistance(new Date(question.createdAt), new Date(), { addSuffix: true });
  
  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-700";
    
    const categoryColors: Record<string, string> = {
      science: "bg-blue-100 text-blue-700",
      history: "bg-amber-100 text-amber-700",
      technology: "bg-purple-100 text-purple-700",
      culture: "bg-pink-100 text-pink-700",
      education: "bg-green-100 text-green-700",
      nature: "bg-emerald-100 text-emerald-700",
      sports: "bg-orange-100 text-orange-700",
      entertainment: "bg-indigo-100 text-indigo-700",
      food: "bg-rose-100 text-rose-700",
      travel: "bg-cyan-100 text-cyan-700",
      business: "bg-slate-100 text-slate-700",
      health: "bg-teal-100 text-teal-700",
      arts: "bg-fuchsia-100 text-fuchsia-700",
      language: "bg-violet-100 text-violet-700",
      surprise: "bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 text-purple-700"
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-700";
  };
  
  // Easter egg animations
  const isEasterEgg = question.isEasterEgg || question.category === 'surprise';
  
  return (
    <motion.div
      whileHover={isEasterEgg ? { scale: 1.02, rotate: isHovered ? 1 : 0 } : { scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={cn(
        "mb-4 hover:shadow-md transition-shadow duration-200",
        isEasterEgg && isHovered && "border-2 border-pink-300"
      )}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Link to={`/question/${question.id}`} className="text-qa-text hover:text-qa-primary">
              {question.title}
            </Link>
            {isEasterEgg && (
              <PartyPopper 
                className={cn(
                  "h-4 w-4 text-pink-500",
                  isHovered && "animate-spin"
                )} 
              />
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pb-2">
          {showContent && (
            <p className="text-sm text-gray-600 mb-1">
              {question.content.length > 200
                ? `${question.content.substring(0, 200)}...`
                : question.content}
            </p>
          )}
          
          {question.imageUrl && (
            <div className="my-2">
              <img 
                src={question.imageUrl} 
                alt={question.title} 
                className={cn(
                  "rounded-md max-h-40 w-auto object-cover",
                  isEasterEgg && isHovered && "animate-pulse"
                )}
              />
            </div>
          )}
          
          <div className="flex flex-wrap mt-3 gap-2">
            {question.category && (
              <div className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs",
                getCategoryColor(question.category)
              )}>
                <Tag className="w-3 h-3 mr-1" />
                {question.category}
              </div>
            )}
            
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
            className={cn("text-xs", isEasterEgg && isHovered && "animate-pulse")}
            onClick={handleVote}
            disabled={dailyVotesRemaining <= 0 && !hasVoted}
          >
            <ThumbsUp className="w-3 h-3 mr-1" /> 
            {question.upvotes}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
