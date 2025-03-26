import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchProducers, deleteProducer } from '@/features/producersSlice';
import Link from 'next/link';
import { Producer } from '@/features/producersSlice';

const ProducerList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { producers, loading, error } = useSelector((state: RootState) => state.producers);

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this producer?')) {
      try {
        await dispatch(deleteProducer(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete producer:', error);
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
        <h1 className="text-3xl font-bold text-gray-500">Producers</h1>
        <Link
          href="/producers/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Producer
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {producers.map((producer: Producer) => (
          <div
            key={producer._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{producer.name}</h2>
              <p className="mb-2">Gender: {producer.gender}</p>
              <p className="mb-2">
                Date of Birth: {new Date(producer.dateOfBirth).toLocaleDateString()}
              </p>
              <p className="mb-4">{producer.bio}</p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Movies Produced:</h3>
                {producer.movies.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {producer.movies.map(movie => (
                      <li key={movie._id}>
                        {movie.name} ({movie.yearOfRelease})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No movies produced yet</p>
                )}
              </div>
              <div className="flex justify-between">
                <Link
                  href={`/producers/${producer._id}/edit`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(producer._id)}
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

export default ProducerList;