
import { User, Question, Answer } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/context/LanguageContext';

interface VotingActionsProps {
  user: User | null;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  dailyVotes: { date: string; count: number };
  setDailyVotes: React.Dispatch<React.SetStateAction<{ date: string; count: number }>>;
}

export const useVotingActions = ({
  user,
  questions,
  setQuestions,
  answers,
  setAnswers,
  dailyVotes,
  setDailyVotes
}: VotingActionsProps) => {
  const { t } = useLanguage();

  const voteQuestion = (questionId: string, voteType: 'up') => {
    if (!user) return;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    if (question.userVote === 'up') {
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            upvotes: q.upvotes - 1,
            userVote: null,
            userVoteDate: undefined
          };
        }
        return q;
      }));
      return;
    }
    
    if (dailyVotes.count >= 5) {
      toast({
        title: t("voteLimit").en,
        description: t("voteLimitDesc").en,
        variant: "destructive",
      });
      return;
    }
    
    setDailyVotes({
      ...dailyVotes,
      count: dailyVotes.count + 1
    });
    
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        let newUpvotes = question.upvotes;
        
        if (question.userVote === 'up') newUpvotes--;
        newUpvotes++;
        
        return {
          ...question,
          upvotes: newUpvotes,
          userVote: question.userVote === voteType ? null : voteType,
          userVoteDate: new Date().toISOString()
        };
      }
      return question;
    }));
  };

  const voteAnswer = (answerId: string, voteType: 'up') => {
    if (!user) return;
    
    const answer = answers.find(a => a.id === answerId);
    if (!answer) return;
    
    if (answer.userVote === 'up') {
      setAnswers(answers.map(a => {
        if (a.id === answerId) {
          return {
            ...a,
            upvotes: a.upvotes - 1,
            userVote: null,
            userVoteDate: undefined
          };
        }
        return a;
      }));
      return;
    }
    
    if (dailyVotes.count >= 5) {
      toast({
        title: t("voteLimit").en,
        description: t("voteLimitDesc").en,
        variant: "destructive",
      });
      return;
    }
    
    setDailyVotes({
      ...dailyVotes,
      count: dailyVotes.count + 1
    });
    
    setAnswers(answers.map(answer => {
      if (answer.id === answerId) {
        let newUpvotes = answer.upvotes;
        
        if (answer.userVote === 'up') newUpvotes--;
        newUpvotes++;
        
        return {
          ...answer,
          upvotes: newUpvotes,
          userVote: answer.userVote === voteType ? null : voteType,
          userVoteDate: new Date().toISOString()
        };
      }
      return answer;
    }));
  };

  const resetVoteCount = () => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can reset vote counts.",
        variant: "destructive",
      });
      return;
    }
    
    setDailyVotes({
      date: new Date().toDateString(),
      count: 0
    });
    
    toast({
      title: "Votes Reset",
      description: "Daily vote count has been reset successfully.",
    });
  };

  return {
    voteQuestion,
    voteAnswer,
    resetVoteCount
  };
};
