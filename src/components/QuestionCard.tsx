
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, PartyPopper } from "lucide-react";
import { formatDistance } from "date-fns";
import { useQA } from "@/context/QAContext";
import { Question } from "@/types/qa";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CategoryBadge from "./question/CategoryBadge";
import AttachmentBadge from "./question/AttachmentBadge";
import SparkleEffect from "./question/SparkleEffect";
import QuestionImage from "./question/QuestionImage";

interface QuestionCardProps {
  question: Question;
  showContent?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, showContent = true }) => {
  const { voteQuestion, dailyVotesRemaining } = useQA();
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  const handleVote = () => {
    voteQuestion(question.id, "up");
  };
  
  useEffect(() => {
    if (isHovered && (question.isEasterEgg || question.category === 'surprise')) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHovered, question.isEasterEgg, question.category]);
  
  const hasVoted = !!question.userVote;
  const formattedDate = formatDistance(new Date(question.createdAt), new Date(), { addSuffix: true });
  
  // Special animation variants for Easter eggs
  const easterEggVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    },
    hoverRotate: {
      scale: 1.03, 
      rotate: [0, 1, -1, 1, 0],
      transition: { duration: 0.5 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };
  
  // Regular card variants
  const cardVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.01,
      boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.99,
      transition: { duration: 0.1 }
    }
  };

  const isEasterEgg = question.isEasterEgg || question.category === 'surprise';

  return (
    <motion.div
      variants={isEasterEgg ? easterEggVariants : cardVariants}
      initial="initial"
      whileHover={isEasterEgg && isHovered ? "hoverRotate" : "hover"}
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card className={cn(
        "mb-4 hover:shadow-md transition-shadow duration-200",
        isEasterEgg && isHovered && "border-2 border-pink-300"
      )}>
        {showSparkles && <SparkleEffect />}
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Link to={`/question/${question.id}`} className="text-qa-text hover:text-qa-primary">
              {question.title}
            </Link>
            {isEasterEgg && (
              <motion.div
                animate={{ 
                  rotate: isHovered ? [0, 10, -10, 10, 0] : 0,
                  scale: isHovered ? [1, 1.2, 1] : 1
                }}
                transition={{ duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
              >
                <PartyPopper className="h-4 w-4 text-pink-500" />
              </motion.div>
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
            <QuestionImage 
              src={question.imageUrl} 
              alt={question.title} 
              isEasterEgg={isEasterEgg} 
              isHovered={isHovered} 
            />
          )}
          
          <div className="flex flex-wrap mt-3 gap-2">
            {question.category && (
              <CategoryBadge category={question.category} />
            )}
            
            {question.article && (
              <AttachmentBadge type="article" />
            )}
            
            {question.source && (
              <AttachmentBadge type="source" url={question.source} />
            )}
            
            {question.imageUrl && (
              <AttachmentBadge type="image" />
            )}
            
            {question.attachment && (
              <AttachmentBadge 
                type={question.attachment.type} 
                name={question.attachment.name} 
                url={question.attachment.url}
              />
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
            className={cn("text-xs")}
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
