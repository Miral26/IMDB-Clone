import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchActors, deleteActor } from '@/features/actorsSlice';
import Link from 'next/link';
import { Actor } from '@/features/actorsSlice';

const ActorsDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { actors, loading, error } = useSelector((state: RootState) => state.actors);

  useEffect(() => {
    dispatch(fetchActors());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this actor?')) {
      try {
        await dispatch(deleteActor(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete actor:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-500">Actors</h1>
        <Link
          href="/actors/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Actor
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {actors.map((actor: Actor) => (
          <div
            key={actor._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{actor.name}</h2>
              <p className="mb-2">Gender: {actor.gender}</p>
              <p className="mb-2">
                Date of Birth: {new Date(actor.dateOfBirth).toLocaleDateString()}
              </p>
              <p className="mb-4">{actor.bio}</p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Movies:</h3>
                {actor.movies.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {actor.movies.map((movie,index) => (
                      <li key={index}>
                        {movie.name} ({movie.yearOfRelease})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No movies yet</p>
                )}
              </div>
              <div className="flex justify-between">
                <Link
                  href={`/actors/${actor._id}/edit`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(actor._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorsDetail;