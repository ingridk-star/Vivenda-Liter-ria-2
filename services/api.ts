
import { Review } from '../types';

const STORAGE_KEY = 'vl_database_v1';

// Mock data para simular o "mundo" da Vivenda Literária
const MOCK_COMMUNITY_REVIEWS: Review[] = [
  {
    id: 'c1',
    title: 'O Retrato de Dorian Gray',
    author: 'Oscar Wilde',
    rating: 5,
    content: 'Uma exploração profunda da alma e da estética.',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400',
    date: '10/05/2024',
    likes: 124,
    genre: 'Clássico'
  },
  {
    id: 'c2',
    title: 'Torto Arado',
    author: 'Itamar Vieira Junior',
    rating: 5,
    content: 'Um épico sobre terra e família no sertão baiano.',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=400',
    date: '12/05/2024',
    likes: 89,
    genre: 'Contemporâneo'
  }
];

export const api = {
  // Simular delay de rede
  delay: () => new Promise(resolve => setTimeout(resolve, 800)),

  async getMyReviews(): Promise<Review[]> {
    await this.delay();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveReview(review: Review): Promise<void> {
    const reviews = await this.getMyReviews();
    const updated = [review, ...reviews];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async deleteReview(id: string): Promise<void> {
    const reviews = await this.getMyReviews();
    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async getGlobalFeed(): Promise<Review[]> {
    await this.delay();
    const myReviews = await this.getMyReviews();
    return [...myReviews, ...MOCK_COMMUNITY_REVIEWS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }
};
