
import { User, Question, Answer } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";

interface AdminActionsProps {
  user: User | null;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export const useAdminActions = ({
  user,
  questions,
  setQuestions,
}: AdminActionsProps) => {

  const postQuestion = async (questionId: string, answerId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can post questions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const question = questions.find(q => q.id === questionId);
      
      if (!question) {
        toast({
          title: "Error",
          description: "Question or answer not found.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/creatomate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.title,
          answer: "Answer content" // This will be replaced with the actual answer in the component
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post content');
      }

      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { ...q, posted: true };
        }
        return q;
      }));

      toast({
        title: "Posted Successfully",
        description: "The question and answer have been posted.",
      });
    } catch (error) {
      console.error('Error posting content:', error);
      toast({
        title: "Error",
        description: "Failed to post content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    postQuestion
  };
};
