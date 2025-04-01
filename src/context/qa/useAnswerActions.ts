
import { User, Question, Answer } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface AnswerActionsProps {
  user: User | null;
  questions: Question[];
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  checkContributionStatus: () => boolean;
}

export const useAnswerActions = ({
  user,
  answers,
  setAnswers,
  checkContributionStatus
}: AnswerActionsProps) => {

  const addAnswer = (
    questionId: string, 
    content: string, 
    metadata?: {
      factCheck?: string | null;
      simplifiedQuestion?: string | null;
      simplifiedAnswer?: string | null;
    }
  ) => {
    if (!user) return;
    
    // Generate punchline for the answer
    const punchline = content.length > 50 
      ? `${content.substring(0, 50)}...` 
      : content;
    
    const newAnswer: Answer = {
      id: uuidv4(),
      questionId,
      content,
      punchline,
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      upvotes: 0,
      factCheck: metadata?.factCheck || null,
      simplifiedQuestion: metadata?.simplifiedQuestion || null,
      simplifiedAnswer: metadata?.simplifiedAnswer || null
    };
    
    setAnswers([...answers, newAnswer]);
    const isNowContributed = checkContributionStatus();
    
    toast({
      title: "Svar bætt við",
      description: "Svarið þitt hefur verið bætt við!",
    });
  };

  return {
    addAnswer
  };
};
