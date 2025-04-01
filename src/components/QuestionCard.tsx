
import React, { useState, useEffect } from "react";
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
  
  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-gray-100 text-gray-700";
    
    const categoryColors: Record<string, string> = {
      animals: "bg-amber-100 text-amber-700",
      space: "bg-indigo-100 text-indigo-700",
      nature: "bg-emerald-100 text-emerald-700",
      science: "bg-blue-100 text-blue-700",
      history: "bg-amber-100 text-amber-700",
      art: "bg-pink-100 text-pink-700",
      music: "bg-purple-100 text-purple-700",
      food: "bg-rose-100 text-rose-700",
      books: "bg-cyan-100 text-cyan-700",
      games: "bg-orange-100 text-orange-700",
      puzzles: "bg-indigo-100 text-indigo-700",
      funnyFacts: "bg-violet-100 text-violet-700",
      magic: "bg-fuchsia-100 text-fuchsia-700",
      rainbow: "bg-teal-100 text-teal-700",
      surprise: "bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 text-purple-700"
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-700";
  };
  
  // Easter egg animations
  const isEasterEgg = question.isEasterEgg || question.category === 'surprise';
  
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
        {showSparkles && (
          <SparkleEffect />
        )}
        
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
            <div className="my-2">
              <motion.img 
                src={question.imageUrl} 
                alt={question.title} 
                className={cn(
                  "rounded-md max-h-40 w-auto object-cover",
                )}
                animate={
                  isEasterEgg && isHovered 
                    ? { scale: [1, 1.02, 1], opacity: [1, 0.9, 1] } 
                    : {}
                }
                transition={{ duration: 2, repeat: isEasterEgg && isHovered ? Infinity : 0 }}
              />
            </div>
          )}
          
          <div className="flex flex-wrap mt-3 gap-2">
            {question.category && (
              <motion.div 
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs",
                  getCategoryColor(question.category)
                )}
                whileHover={{ scale: 1.05 }}
              >
                <Tag className="w-3 h-3 mr-1" />
                {question.category}
              </motion.div>
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

// Sparkle effect component for Easter eggs
const SparkleEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            scale: 0,
            opacity: 1,
            x: '50%',
            y: '50%',
          }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [`50%`, `${30 + Math.random() * 40}%`],
            y: [`50%`, `${30 + Math.random() * 40}%`],
          }}
          transition={{ 
            duration: 1 + Math.random(),
            delay: Math.random() * 0.3,
            ease: "easeOut" 
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Sparkles 
            className="text-pink-400" 
            size={10 + Math.random() * 15} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default QuestionCard;
