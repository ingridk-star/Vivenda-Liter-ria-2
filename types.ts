
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Review {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  rating: number;
  content: string;
  instagramCaption?: string;
  coverUrl?: string;
  date: string;
  genre?: string;
  likes: number;
  isLiked?: boolean;
}

export interface UserStats {
  totalBooks: number;
  pagesRead: number;
  favoriteGenre: string;
  readingGoal: number;
}

export type AppTab = 'library' | 'feed' | 'add' | 'settings';
