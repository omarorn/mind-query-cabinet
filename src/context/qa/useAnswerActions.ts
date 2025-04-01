
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

  const addAnswer = (questionId: string, content: string) => {
    if (!user) return;
    
    const newAnswer: Answer = {
      id: uuidv4(),
      questionId,
      content,
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      upvotes: 0
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
