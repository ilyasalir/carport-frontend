"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

export type DetailsTypeContext = {
  isOpen: boolean
  updateIsOpen: (isOpen: boolean) => void;
};

const defaultValue = {
  isOpen: false,
  updateIsOpen: () => null
};

export const DetailsContext = createContext<DetailsTypeContext>(defaultValue);

const DetailsProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateIsOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <DetailsContext.Provider value={{ isOpen, updateIsOpen }}>
      {children}
    </DetailsContext.Provider>
  );
};

export default DetailsProvider;
