'use client';

import { Provider } from 'react-redux';
import { store } from '@/features/store';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <Provider store={store}>{children}</Provider>;
} 