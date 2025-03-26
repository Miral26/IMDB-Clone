'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchMovieById } from '@/features/moviesSlice';
import { use } from 'react';
import MovieDetail from '@/components/MovieDetail';

export default function MovieDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedMovie, loading, error } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error || !selectedMovie) {
    return <div className="text-center text-red-500">{error || 'Movie not found'}</div>;
  }

  return <MovieDetail movie={selectedMovie} id={id} />;
} 