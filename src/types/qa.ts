
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
  | 'science'
  | 'history'
  | 'technology'
  | 'culture'
  | 'education'
  | 'nature'
  | 'sports'
  | 'entertainment'
  | 'food'
  | 'travel'
  | 'business'
  | 'health'
  | 'arts'
  | 'language'
  | 'surprise';
