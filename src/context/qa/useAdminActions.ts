
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
  setQuestions
}: AdminActionsProps) => {
  const postQuestion = async (questionId: string, answerId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Aðgangi hafnað",
        description: "Aðeins stjórnendur geta birt spurningar á Creatomate.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const question = questions.find(q => q.id === questionId);
      
      if (!question) {
        toast({
          title: "Villa",
          description: "Spurning fannst ekki.",
          variant: "destructive",
        });
        return;
      }
      
      // Find the answer in localStorage
      const answersJson = localStorage.getItem('qa-answers');
      const answers: Answer[] = answersJson ? JSON.parse(answersJson) : [];
      const answer = answers.find(a => a.id === answerId);
      
      if (!answer) {
        toast({
          title: "Villa",
          description: "Svar fannst ekki.",
          variant: "destructive",
        });
        return;
      }
      
      // Call the Supabase Edge Function
      const response = await fetch('/api/creatomate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.title,
          answer: answer.content,
          factChecked: answer.factCheck,
          simplifiedQuestion: answer.simplifiedQuestion,
          simplifiedAnswer: answer.simplifiedAnswer
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Óþekkt villa við birtingu');
      }
      
      // Mark the question as posted
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, posted: true } : q
      ));
      
      toast({
        title: "Birting tókst",
        description: "Spurning og svar hefur verið birt á Creatomate.",
      });
      
    } catch (error) {
      console.error("Error posting to Creatomate:", error);
      toast({
        title: "Villa við birtingu",
        description: error instanceof Error ? error.message : "Villa við að birta á Creatomate",
        variant: "destructive",
      });
    }
  };

  return {
    postQuestion
  };
};
