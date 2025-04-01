import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, Answer, User } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/context/LanguageContext';

interface QAContextType {
  user: User | null;
  questions: Question[];
  answers: Answer[];
  hasContributed: boolean;
  dailyVotesRemaining: number;
  createUser: (name: string, isAdmin?: boolean) => void;
  addQuestion: (
    title: string, 
    content: string, 
    article?: string,
    attachment?: {
      type: 'file' | 'video' | 'link';
      url: string;
      name?: string;
    } | null
  ) => void;
  addAnswer: (questionId: string, content: string) => void;
  voteQuestion: (questionId: string, voteType: 'up') => void;
  voteAnswer: (answerId: string, voteType: 'up') => void;
  resetVoteCount: () => void;
  postQuestion: (questionId: string, answerId: string) => Promise<void>;
  userQuestionCount: number;
  userAnswerCount: number;
}

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hasContributed, setHasContributed] = useState(false);
  const [dailyVotes, setDailyVotes] = useState<{date: string, count: number}>({
    date: new Date().toDateString(),
    count: 0
  });

  const dailyVotesRemaining = 5 - dailyVotes.count;

  useEffect(() => {
    const storedUser = localStorage.getItem('qa-user');
    const storedQuestions = localStorage.getItem('qa-questions');
    const storedAnswers = localStorage.getItem('qa-answers');
    const storedContributed = localStorage.getItem('qa-contributed');
    const storedDailyVotes = localStorage.getItem('qa-daily-votes');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    if (storedContributed) setHasContributed(JSON.parse(storedContributed));
    if (storedDailyVotes) setDailyVotes(JSON.parse(storedDailyVotes));
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (dailyVotes.date !== today) {
      setDailyVotes({
        date: today,
        count: 0
      });
    }
  }, [dailyVotes.date]);

  useEffect(() => {
    if (user) localStorage.setItem('qa-user', JSON.stringify(user));
    if (questions.length) localStorage.setItem('qa-questions', JSON.stringify(questions));
    if (answers.length) localStorage.setItem('qa-answers', JSON.stringify(answers));
    localStorage.setItem('qa-contributed', JSON.stringify(hasContributed));
    localStorage.setItem('qa-daily-votes', JSON.stringify(dailyVotes));
  }, [user, questions, answers, hasContributed, dailyVotes]);

  const createUser = (name: string, isAdmin: boolean = false) => {
    const newUser = {
      id: uuidv4(),
      name,
      isAdmin
    };
    setUser(newUser);
    toast({
      title: "Welcome!",
      description: `Hello ${name}, you can now start contributing!`,
    });
  };

  const addQuestion = (
    title: string, 
    content: string, 
    article?: string,
    attachment?: {
      type: 'file' | 'video' | 'link';
      url: string;
      name?: string;
    } | null
  ) => {
    if (!user) return;
    
    const newQuestion: Question = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date().toISOString(),
      authorId: user.id,
      authorName: user.name,
      upvotes: 0,
      article: article,
      attachment: attachment || undefined
    };
    
    setQuestions([...questions, newQuestion]);
    checkContributionStatus();
    
    toast({
      title: "Question Added",
      description: "Your question has been added successfully!",
    });
  };

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
    checkContributionStatus();
    
    toast({
      title: "Answer Added",
      description: "Your answer has been added successfully!",
    });
  };

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
      const answer = answers.find(a => a.id === answerId);
      
      if (!question || !answer) {
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
          answer: answer.content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post content');
      }

      // Update the question's posted status
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

  const userQuestionCount = user 
    ? questions.filter(q => q.authorId === user.id).length 
    : 0;
    
  const userAnswerCount = user 
    ? answers.filter(a => a.authorId === user.id).length 
    : 0;

  const checkContributionStatus = () => {
    if (!hasContributed && user) {
      const userQuestionsCount = questions.filter(q => q.authorId === user.id).length + 1;
      const userAnswersCount = answers.filter(a => a.authorId === user.id).length;
      
      if (userQuestionsCount + userAnswersCount >= 3) {
        setHasContributed(true);
        toast({
          title: "Access Granted!",
          description: "Thank you for contributing! You now have access to all Q&A content.",
          variant: "default",
        });
      }
    }
  };

  return (
    <QAContext.Provider value={{ 
      user, 
      questions, 
      answers, 
      hasContributed,
      dailyVotesRemaining,
      createUser, 
      addQuestion, 
      addAnswer, 
      voteQuestion, 
      voteAnswer,
      resetVoteCount,
      postQuestion,
      userQuestionCount,
      userAnswerCount
    }}>
      {children}
    </QAContext.Provider>
  );
};

export const useQA = () => {
  const context = useContext(QAContext);
  if (context === undefined) {
    throw new Error('useQA must be used within a QAProvider');
  }
  return context;
};
