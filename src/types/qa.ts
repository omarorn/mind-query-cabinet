
export interface User {
  id: string;
  name: string;
  isAdmin?: boolean;
  email?: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  userVote?: 'up' | null;
  userVoteDate?: string;
  attachment?: {
    type: 'file' | 'video' | 'link';
    url: string;
    name?: string;
  };
  article?: string;
  posted?: boolean;
  source?: string;
  imageUrl?: string;
  category?: string;
  isEasterEgg?: boolean;
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  userVote?: 'up' | null;
  userVoteDate?: string;
}

export type QuestionCategory = 
  | 'animals'
  | 'space'
  | 'nature'
  | 'science'
  | 'history'
  | 'art'
  | 'music'
  | 'food'
  | 'books'
  | 'games'
  | 'puzzles'
  | 'funnyFacts'
  | 'magic'
  | 'rainbow'
  | 'surprise';
