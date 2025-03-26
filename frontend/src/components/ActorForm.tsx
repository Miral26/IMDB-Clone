'use client';

import {  useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AppDispatch } from '@/features/store';
import { createActor, updateActor } from '@/features/actorsSlice';
import { Actor } from '@/features/actorsSlice';

interface ActorFormProps {
  actor?: Actor;
  isEdit?: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  bio: yup.string().required('Biography is required').min(10, 'Biography must be at least 10 characters'),
});

type FormData = yup.InferType<typeof schema>;

export default function ActorForm({ actor, isEdit = false }: ActorFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (actor) {
      setValue('name', actor.name);
      setValue('gender', actor.gender);
      setValue('dateOfBirth', actor.dateOfBirth.split('T')[0]);
      setValue('bio', actor.bio);
    }
  }, [actor, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && actor) {
        await dispatch(updateActor({ id: actor._id, data })).unwrap();
      } else {
        await dispatch(createActor(data)).unwrap();
      }
      router.push('/actors');
    } catch (error) {
      console.error('Failed to save actor:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">{isEdit ? 'Edit Actor' : 'Add New Actor'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Actor Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender
          </label>
          <select
            id="gender"
            {...register('gender')}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register('dateOfBirth')}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Biography
          </label>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.bio && (
            <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/actors')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEdit ? 'Update Actor' : 'Create Actor'}
          </button>
        </div>
      </form>
    </div>
  );
} 