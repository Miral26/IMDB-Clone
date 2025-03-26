'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchMovieById } from '@/features/moviesSlice';
import MovieForm from '@/components/MovieForm';
import { use } from 'react';

export default function EditMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMovie } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  if (!selectedMovie) {
    return <div className="text-center">Loading...</div>;
  }

  return <MovieForm movie={selectedMovie} isEdit={true} />;
} 