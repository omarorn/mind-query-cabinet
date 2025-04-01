
import { User, Question, Answer, QuestionCategory } from '@/types/qa';

export interface QAContextType {
  user: User | null;
  questions: Question[];
  answers: Answer[];
  hasContributed: boolean;
  dailyVotesRemaining: number;
  createUser: (name: string, email?: string, isAdmin?: boolean) => void;
  updateUser: (name: string, email: string) => Promise<void>;
  login: (email: string) => void;
  logout: () => void;
  addQuestion: (
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
  ) => void;
  addAnswer: (
    questionId: string, 
    content: string, 
    metadata?: {
      factCheck?: string | null;
      simplifiedQuestion?: string | null;
      simplifiedAnswer?: string | null;
    }
  ) => void;
  voteQuestion: (questionId: string, voteType: 'up') => void;
  voteAnswer: (answerId: string, voteType: 'up') => void;
  resetVoteCount: () => void;
  postQuestion: (questionId: string, answerId: string) => Promise<void>;
  userQuestionCount: number;
  userAnswerCount: number;
  deleteQuestion: (questionId: string) => void;
  addQuestionVotes: (questionId: string, amount: number) => void;
  updateQuestionCategory: (questionId: string, category: string) => void;
}
