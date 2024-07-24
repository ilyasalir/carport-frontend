"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

export type PopUpTypeContext = {
  isOpen: boolean;
  updateIsOpen: (isOpen: boolean) => void;
};

const defaultValue = {
  isOpen: false,
  updateIsOpen: () => null,
};

export const PopUpContext = createContext<PopUpTypeContext>(defaultValue);

const PopUpProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const updateIsOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <PopUpContext.Provider value={{ isOpen, updateIsOpen }}>
      {children}
    </PopUpContext.Provider>
  );
};

export default PopUpProvider;
