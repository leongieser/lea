'use client';

import { useEffect, useState } from 'react';

import { SidePanelProvider } from './sidepanel';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted = false, setMounted] = useState<boolean>();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <SidePanelProvider>{children}</SidePanelProvider>;
}
