import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Actor {
  _id: string;
  name: string;
}

interface Producer {
  name: string;
}

interface Movie {
  name: string;
  yearOfRelease: number;
  plot: string;
  poster: string;
  producer: Producer;
  actors: Actor[];
}

interface MovieDetailProps {
  movie: Movie;
  id: string;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, id }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Movie Details</h1>
        <div className="space-x-4">
          <Link
            href={`/movies/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Edit Movie
          </Link>
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back to Movies
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative w-full h-96">
          <Image
            src={movie.poster}
            alt={movie.name}
            fill
            className="object-contain rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={movie.poster.startsWith('data:')}
          />
        </div>
        <div className="p-6 text-black">
          <h2 className="text-2xl font-bold mb-4">{movie.name}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Year of Release</h3>
              <p>{movie.yearOfRelease}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Plot</h3>
              <p className="whitespace-pre-wrap">{movie.plot}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Producer</h3>
              <p>{movie.producer.name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Actors</h3>
              <ul className="list-disc list-inside">
                {movie.actors.map((actor) => (
                  <li key={actor._id}>{actor.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;