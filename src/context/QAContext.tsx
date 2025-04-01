import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question, Answer, User } from '@/types/qa';
import { toast } from "@/components/ui/use-toast";

interface QAContextType {
  user: User | null;
  questions: Question[];
  answers: Answer[];
  hasContributed: boolean;
  createUser: (name: string) => void;
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
  voteQuestion: (questionId: string, voteType: 'up' | 'down') => void;
  voteAnswer: (answerId: string, voteType: 'up' | 'down') => void;
  userQuestionCount: number;
  userAnswerCount: number;
}

const QAContext = createContext<QAContextType | undefined>(undefined);

export const QAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [hasContributed, setHasContributed] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('qa-user');
    const storedQuestions = localStorage.getItem('qa-questions');
    const storedAnswers = localStorage.getItem('qa-answers');
    const storedContributed = localStorage.getItem('qa-contributed');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedQuestions) setQuestions(JSON.parse(storedQuestions));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    if (storedContributed) setHasContributed(JSON.parse(storedContributed));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('qa-user', JSON.stringify(user));
    if (questions.length) localStorage.setItem('qa-questions', JSON.stringify(questions));
    if (answers.length) localStorage.setItem('qa-answers', JSON.stringify(answers));
    localStorage.setItem('qa-contributed', JSON.stringify(hasContributed));
  }, [user, questions, answers, hasContributed]);

  const createUser = (name: string) => {
    const newUser = {
      id: uuidv4(),
      name
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
      downvotes: 0,
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
      upvotes: 0,
      downvotes: 0
    };
    
    setAnswers([...answers, newAnswer]);
    checkContributionStatus();
    
    toast({
      title: "Answer Added",
      description: "Your answer has been added successfully!",
    });
  };

  const voteQuestion = (questionId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    
    setQuestions(questions.map(question => {
      if (question.id === questionId) {
        let newUpvotes = question.upvotes;
        let newDownvotes = question.downvotes;
        
        if (question.userVote === 'up') newUpvotes--;
        if (question.userVote === 'down') newDownvotes--;
        
        if (voteType === 'up') newUpvotes++;
        if (voteType === 'down') newDownvotes++;
        
        return {
          ...question,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: question.userVote === voteType ? null : voteType
        };
      }
      return question;
    }));
  };

  const voteAnswer = (answerId: string, voteType: 'up' | 'down') => {
    if (!user) return;
    
    setAnswers(answers.map(answer => {
      if (answer.id === answerId) {
        let newUpvotes = answer.upvotes;
        let newDownvotes = answer.downvotes;
        
        if (answer.userVote === 'up') newUpvotes--;
        if (answer.userVote === 'down') newDownvotes--;
        
        if (voteType === 'up') newUpvotes++;
        if (voteType === 'down') newDownvotes++;
        
        return {
          ...answer,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: answer.userVote === voteType ? null : voteType
        };
      }
      return answer;
    }));
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
      createUser, 
      addQuestion, 
      addAnswer, 
      voteQuestion, 
      voteAnswer,
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
