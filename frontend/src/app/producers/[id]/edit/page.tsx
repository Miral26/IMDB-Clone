'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { fetchProducers } from '@/features/producersSlice';
import ProducerForm from '@/components/ProducerForm';
import { Producer } from '@/features/producersSlice';
import { use } from 'react';

export default function EditProducer({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { producers } = useSelector((state: RootState) => state.producers);
  const [producer, setProducer] = useState<Producer | undefined>();

  useEffect(() => {
    dispatch(fetchProducers());
  }, [dispatch]);

  useEffect(() => {
    const foundProducer = producers.find(p => p._id === resolvedParams.id);
    setProducer(foundProducer);
  }, [producers, resolvedParams.id]);

  if (!producer) {
    return <div className="text-center">Loading...</div>;
  }

  return <ProducerForm producer={producer} isEdit={true} />;
} 