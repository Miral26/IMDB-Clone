'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch, RootState } from '@/features/store';
import { createMovie, updateMovie, CreateMovieData, UpdateMovieData } from '@/features/moviesSlice';
import { fetchProducers, createProducer } from '@/features/producersSlice';
import { fetchActors, createActor } from '@/features/actorsSlice';
import { Movie } from '@/features/moviesSlice';
import { Resolver } from 'react-hook-form';

interface MovieFormProps {
  movie?: Movie;
  isEdit?: boolean;
}

interface Option {
  value: string;
  label: string;
}

interface MovieFormData {
  name: string;
  yearOfRelease: string;
  plot: string;
  poster: string;
  producerId: string;
  actorIds: string[];
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required').trim(),
  yearOfRelease: yup
    .string()
    .required('Year of release is required')
    .matches(/^\d+$/, 'Year must be a number')
    .test('min', 'First movie was released in 1888', (value) => parseInt(value) >= 1888)
    .test('max', 'Year cannot be in the future', (value) => parseInt(value) <= new Date().getFullYear()),
  plot: yup.string().required('Plot is required'),
  poster: yup.string(),
  producerId: yup.string().required('Producer is required'),
  actorIds: yup.array().of(yup.string()).min(1, 'At least one actor is required'),
}) as yup.ObjectSchema<MovieFormData>;

export default function MovieForm({ movie, isEdit = false }: MovieFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { producers } = useSelector((state: RootState) => state.producers);
  const { actors } = useSelector((state: RootState) => state.actors);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MovieFormData>({
    resolver: yupResolver(schema) as Resolver<MovieFormData>,
    defaultValues: {
      name: movie?.name || '',
      yearOfRelease: movie?.yearOfRelease.toString() || '',
      plot: movie?.plot || '',
      poster: movie?.poster || '',
      producerId: movie?.producer._id || '',
      actorIds: movie?.actors.map(actor => actor._id) || [],
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [newProducer, setNewProducer] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    bio: '',
  });

  const [newActor, setNewActor] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    bio: '',
  });

  const [showNewProducerForm, setShowNewProducerForm] = useState(false);
  const [showNewActorForm, setShowNewActorForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProducers());
    dispatch(fetchActors());
  }, [dispatch]);

  useEffect(() => {
    if (movie) {
      reset({
        name: movie.name,
        yearOfRelease: movie.yearOfRelease.toString(),
        plot: movie.plot,
        poster: movie.poster,
        producerId: movie.producer._id,
        actorIds: movie.actors.map(actor => actor._id),
      });
      setPreviewUrl(movie.poster);
    }
  }, [movie, reset]);

  const producerOptions: Option[] = producers.map(producer => ({
    value: producer._id,
    label: producer.name,
  }));

  const actorOptions: Option[] = actors.map(actor => ({
    value: actor._id,
    label: actor.name,
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: MovieFormData) => {
    try {
      let posterPath = data.poster;

      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          posterPath = reader.result as string;
          
          const movieData: CreateMovieData = {
            name: data.name,
            yearOfRelease: parseInt(data.yearOfRelease),
            plot: data.plot,
            poster: posterPath,
            producer: data.producerId,
            actors: data.actorIds,
          };

          if (isEdit && movie) {
            const updateData: UpdateMovieData = {
              name: movieData.name,
              yearOfRelease: movieData.yearOfRelease,
              plot: movieData.plot,
              poster: movieData.poster,
              producer: movieData.producer,
              actors: movieData.actors,
            };
            await dispatch(updateMovie({ id: movie._id, data: updateData })).unwrap();
          } else {
            await dispatch(createMovie(movieData)).unwrap();
          }
          reset({
            name: '',
            yearOfRelease: '',
            plot: '',
            poster: '',
            producerId: '',
            actorIds: [],
          });
          setSelectedFile(null);
          setPreviewUrl(null);
          setUploadError(null);
          
          router.push('/');
        };
      } else {
        const movieData: CreateMovieData = {
          name: data.name,
          yearOfRelease: parseInt(data.yearOfRelease),
          plot: data.plot,
          poster: posterPath,
          producer: data.producerId,
          actors: data.actorIds,
        };

        if (isEdit && movie) {
          const updateData: UpdateMovieData = {
            name: movieData.name,
            yearOfRelease: movieData.yearOfRelease,
            plot: movieData.plot,
            poster: movieData.poster,
            producer: movieData.producer,
            actors: movieData.actors,
          };
          await dispatch(updateMovie({ id: movie._id, data: updateData })).unwrap();
        } else {
          await dispatch(createMovie(movieData)).unwrap();
        }
        
        // Clear form data
        reset({
          name: '',
          yearOfRelease: '',
          plot: '',
          poster: '',
          producerId: '',
          actorIds: [],
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
        
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to save movie', error);
      setUploadError('Failed to save movie. Please try again.');
    }
  };

  const handleNewProducerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const producerData = {
        ...newProducer,
        dateOfBirth: newProducer.dateOfBirth,
      };
      await dispatch(createProducer(producerData)).unwrap();
      setShowNewProducerForm(false);
      setNewProducer({ name: '', gender: '', dateOfBirth: '', bio: '' });
    } catch (error) {
      console.error('Failed to create producer:', error);
    }
  };

  const handleNewActorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const actorData = {
        ...newActor,
        dateOfBirth: newActor.dateOfBirth,
      };
      await dispatch(createActor(actorData)).unwrap();
      setShowNewActorForm(false);
      setNewActor({ name: '', gender: '', dateOfBirth: '', bio: '' });
    } catch (error) {
      console.error('Failed to create actor:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Movie' : 'Add New Movie'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Movie Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="name"
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="yearOfRelease" className="block text-sm font-medium">
            Year of Release
          </label>
          <Controller
            name="yearOfRelease"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="yearOfRelease"
                min="1888"
                max={new Date().getFullYear()}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.yearOfRelease ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.yearOfRelease && (
            <p className="mt-1 text-sm text-red-600">{errors.yearOfRelease.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="plot" className="block text-sm font-medium">
            Plot
          </label>
          <Controller
            name="plot"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="plot"
                rows={4}
                className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  errors.plot ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            )}
          />
          {errors.plot && (
            <p className="mt-1 text-sm text-red-600">{errors.plot.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="poster" className="block text-sm font-medium">
            Movie Poster
          </label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              id="poster"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>
          {uploadError && (
            <p className="mt-1 text-sm text-red-600">{uploadError}</p>
          )}
          {previewUrl && (
            <div className="mt-2 relative w-full h-48">
              <Image
                src={previewUrl}
                alt="Movie poster preview"
                fill
                className="object-contain rounded-md"
                unoptimized={previewUrl.startsWith('data:')}
                priority
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="producerId" className="block text-sm font-medium">
              Producer
            </label>
            <button
              type="button"
              onClick={() => setShowNewProducerForm(!showNewProducerForm)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showNewProducerForm ? 'Cancel' : 'Add New Producer'}
            </button>
          </div>
          {showNewProducerForm ? (
            <div className="space-y-4 p-4 border rounded-md">
              <input
                type="text"
                placeholder="Producer Name"
                value={newProducer.name}
                onChange={(e) => setNewProducer(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <select
                value={newProducer.gender}
                onChange={(e) => setNewProducer(prev => ({ ...prev, gender: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                value={newProducer.dateOfBirth}
                onChange={(e) => setNewProducer(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Bio"
                value={newProducer.bio}
                onChange={(e) => setNewProducer(prev => ({ ...prev, bio: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleNewProducerSubmit}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Producer
              </button>
            </div>
          ) : (
            <Controller
              name="producerId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="producerId"
                  value={producerOptions.find(option => option.value === field.value)}
                  onChange={(option) => field.onChange(option?.value || '')}
                  options={producerOptions}
                  isClearable
                  className={`mt-1 ${errors.producerId ? 'border-red-300' : ''}`}
                />
              )}
            />
          )}
          {errors.producerId && (
            <p className="mt-1 text-sm text-red-600">{errors.producerId.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="actorIds" className="block text-sm font-medium">
              Actors
            </label>
            <button
              type="button"
              onClick={() => setShowNewActorForm(!showNewActorForm)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showNewActorForm ? 'Cancel' : 'Add New Actor'}
            </button>
          </div>
          {showNewActorForm ? (
            <div className="space-y-4 p-4 border rounded-md">
              <input
                type="text"
                placeholder="Actor Name"
                value={newActor.name}
                onChange={(e) => setNewActor(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <select
                value={newActor.gender}
                onChange={(e) => setNewActor(prev => ({ ...prev, gender: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                value={newActor.dateOfBirth}
                onChange={(e) => setNewActor(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Bio"
                value={newActor.bio}
                onChange={(e) => setNewActor(prev => ({ ...prev, bio: e.target.value }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleNewActorSubmit}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Actor
              </button>
            </div>
          ) : (
            <Controller
              name="actorIds"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  id="actorIds"
                  value={actorOptions.filter(option => field.value.includes(option.value))}
                  onChange={(options) => field.onChange(options.map(option => option.value))}
                  options={actorOptions}
                  isMulti
                  className={`mt-1 ${errors.actorIds ? 'border-red-300' : ''}`}
                />
              )}
            />
          )}
          {errors.actorIds && (
            <p className="mt-1 text-sm text-red-600">{errors.actorIds.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEdit ? 'Update Movie' : 'Create Movie'}
          </button>
        </div>
      </form>
    </div>
  );
} 