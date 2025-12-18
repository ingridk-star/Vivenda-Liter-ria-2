
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isFollowing: boolean;
}

export interface SocialActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
}

export type AppTab = 'library' | 'feed' | 'add' | 'settings';
