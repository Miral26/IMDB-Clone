import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchMovies, deleteMovie } from '@/features/moviesSlice';
import Link from 'next/link';
import { Movie } from '@/features/moviesSlice';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

const MoviesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);

  React.useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Movies</h1>
        <Link
          href="/movies/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Movie
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie: Movie) => (
          <div
            key={movie._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative w-full h-64">
              <Image
                src={movie.poster}
                alt={movie.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={movie.poster.startsWith('data:')}
              />
            </div>
            <div className="p-4 text-black">
              <h2 className="text-xl font-semibold mb-2">{movie.name}</h2>
              <p className=" mb-2">Year: {movie.yearOfRelease}</p>
              <p className=" mb-2">
                Producer: {movie.producer.name}
              </p>
              <p className=" mb-4">
                Actors: {movie.actors.map(actor => actor.name).join(', ')}
              </p>
              <div className="flex justify-between">
                <Link
                  href={`/movies/${movie._id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Details
                </Link>
                <div className="flex gap-4">
                  <Link
                    href={`/movies/${movie._id}/edit`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this movie?')) {
                        dispatch(deleteMovie(movie._id));
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesList;