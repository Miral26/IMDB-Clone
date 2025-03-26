'use client';

import { useEffect } from 'react';
import { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchActorById } from '@/features/actorsSlice';
import ActorForm from '@/components/ActorForm';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditActor({ params }: PageProps) {
  const { id } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedActor, loading, error } = useSelector((state: RootState) => state.actors);

  useEffect(() => {
    if (id) {
      dispatch(fetchActorById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error || !selectedActor) {
    return <div className="text-center text-red-500">{error || 'Actor not found'}</div>;
  }

  return <ActorForm actor={selectedActor} isEdit={true} />;
} 