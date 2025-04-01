
import { User, Question, Answer } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface QuestionActionsProps {
  user: User | null;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  checkContributionStatus: () => boolean;
}

export const useQuestionActions = ({
  user,
  questions,
  setQuestions,
  checkContributionStatus
}: QuestionActionsProps) => {

  const addQuestion = (
    title: string, 
    content: string, 
    article?: string,
    attachment?: {
      type: 'file' | 'video' | 'link';
      url: string;
      name?: string;
    } | null,
    source?: string,
    imageUrl?: string,
    category?: string
  ) => {
    if (!user) return;
    
    const hasEasterEgg = 
      content.toLowerCase().includes("easter egg") || 
      content.toLowerCase().includes("secret") ||
      title.toLowerCase().includes("hidden");
    
    const newQuestion: Question = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      upvotes: 0,
      article: article,
      attachment: attachment || undefined,
      source,
      imageUrl,
      category,
      isEasterEgg: hasEasterEgg || category === 'surprise'
    };
    
    setQuestions([...questions, newQuestion]);
    const isNowContributed = checkContributionStatus();
    
    if (category === 'surprise' || hasEasterEgg) {
      toast({
        title: "✨ Special Question Added! ✨",
        description: "Your magical question has been added with extra sparkle!",
        variant: "default",
      });
    } else {
      toast({
        title: "Question Added",
        description: "Your question has been added successfully!",
      });
    }
  };

  const deleteQuestion = (questionId: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Aðgangi hafnað",
        description: "Aðeins stjórnendur geta eytt spurningum.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    
    setQuestions(updatedQuestions);
    
    toast({
      title: "Spurningu eytt",
      description: "Spurningin hefur verið eytt ásamt öllum svörum.",
    });
  };

  const addQuestionVotes = (questionId: string, amount: number) => {
    if (!user?.isAdmin) {
      toast({
        title: "Aðgangi hafnað",
        description: "Aðeins stjórnendur geta bætt við atkvæðum.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          upvotes: question.upvotes + amount
        };
      }
      return question;
    }));
    
    toast({
      title: "Atkvæðum bætt við",
      description: `${amount} atkvæðum bætt við spurninguna.`,
    });
  };

  const updateQuestionCategory = (questionId: string, category: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Aðgangi hafnað",
        description: "Aðeins stjórnendur geta breytt flokkum spurninga.",
        variant: "destructive",
      });
      return;
    }
    
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        return {
          ...question,
          category
        };
      }
      return question;
    }));
    
    toast({
      title: "Flokkur uppfærður",
      description: "Flokkur spurningar hefur verið uppfærður.",
    });
  };

  return {
    addQuestion,
    deleteQuestion,
    addQuestionVotes,
    updateQuestionCategory
  };
};
