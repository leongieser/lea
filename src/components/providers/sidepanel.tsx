import React, { createContext, ReactNode, useEffect, useState } from 'react';

export type SidePanelContextProps = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

export const SidePanelContext = createContext<
  SidePanelContextProps | undefined
>(undefined);

export const SidePanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(() => {
    const storedState = localStorage.getItem('sideNavIsOpen');
    return storedState === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sideNavIsOpen', String(isOpen));
  }, [isOpen]);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <SidePanelContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidePanelContext.Provider>
  );
};
