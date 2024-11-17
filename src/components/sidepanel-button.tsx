'use client';

import { useSidePanel } from '@/hooks/use-side-panel';
import { PanelLeftOpenIcon } from 'lucide-react';

export default function SidePanelOpener() {
  const { isOpen, open } = useSidePanel();

  if (isOpen) return null;

  return (
    <button
      onClick={open}
      className="absolute left-4 top-4 z-50 cursor-pointer text-zinc-200"
    >
      <PanelLeftOpenIcon className="h-6 w-6" />
      <span className="sr-only">Open Sidepanel</span>
    </button>
  );
}
