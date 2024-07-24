"use client";

import { ReactNode, createContext, useState } from "react";

export type RegisterTypeContext = {
  withAppointment: boolean
  updateWithAppointment: (withAppointment: boolean) => void;
};

const defaultValue = {
  withAppointment: false,
  updateWithAppointment: () => null
};

export const RegisterContext = createContext<RegisterTypeContext>(defaultValue);

const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [withAppointment, setWithAppointment] = useState<boolean>(false);

  const updateWithAppointment = (withAppointment: boolean) => {
    setWithAppointment(withAppointment);
  };

  return (
    <RegisterContext.Provider value={{ withAppointment, updateWithAppointment }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterProvider;
