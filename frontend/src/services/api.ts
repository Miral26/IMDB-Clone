import axios from 'axios';
import { Movie, CreateMovieData, UpdateMovieData } from '@/features/moviesSlice';
import { Actor } from '@/features/actorsSlice';
import { Producer } from '@/features/producersSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imdb-clone-oe9e.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Movie endpoints
export const movieApi = {
  getAll: () => api.get<Movie[]>('/movies'),
  getById: (id: string) => api.get<Movie>(`/movies/${id}`),
  create: (data: CreateMovieData) => api.post<Movie>('/movies', data),
  update: (id: string, data: UpdateMovieData) => api.put<Movie>(`/movies/${id}`, data),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

// Actor endpoints
export const actorApi = {
  getAll: () => api.get<Actor[]>('/actors'),
  getById: (id: string) => api.get<Actor>(`/actors/${id}`),
  create: (data: Omit<Actor, '_id' | 'movies'>) => api.post<Actor>('/actors', data),
  update: (id: string, data: Partial<Actor>) => api.put<Actor>(`/actors/${id}`, data),
  delete: (id: string) => api.delete(`/actors/${id}`),
};

// Producer endpoints
export const producerApi = {
  getAll: () => api.get<Producer[]>('/producers'),
  getById: (id: string) => api.get<Producer>(`/producers/${id}`),
  create: (data: Omit<Producer, '_id' | 'movies'>) => api.post<Producer>('/producers', data),
  update: (id: string, data: Partial<Producer>) => api.put<Producer>(`/producers/${id}`, data),
  delete: (id: string) => api.delete(`/producers/${id}`),
};

export default api; 