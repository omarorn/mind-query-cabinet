
export interface User {
  id: string;
  name: string;
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
