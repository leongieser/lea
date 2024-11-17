import { useContext } from 'react';
import {
  SidePanelContext,
  SidePanelContextProps,
} from '@/components/providers/sidepanel';

export const useSidePanel = (): SidePanelContextProps => {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error('useSidePanel must be used within a UIProvider');
  }
  return context;
};
