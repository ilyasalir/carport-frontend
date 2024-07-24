"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { getWithCredentials } from "../api";
import Cookies from "js-cookie"

export type UserTypeContext = {
  user: User | null;
  updateUserandToken: (user: User | null, token: string | null) => void;
  token: string | null,
  loading: boolean
};

const defaultValue = {
  user: {
    ID: 0,
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    addresses: [],
  },
  updateUserandToken: () => null,
  token: null,
  loading: true
};

export const UserContext = createContext<UserTypeContext>(defaultValue);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initialize loading state

  const updateUserandToken = (user: User | null, token: string | null) => {
    setUser(user);
    setToken(token);
  };

  const tokenCookies = Cookies.get("Authorization");
  const getUser = async () => {
    try {
      if(tokenCookies){
        const response = await getWithCredentials("auth", tokenCookies);
        const data = response.data.data;
        updateUserandToken(data, tokenCookies);
      } else {
        updateUserandToken(null, null)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   if (tokenCookies) {
  //     setToken(tokenCookies);
  //   } else {
  //     setToken(null);
  //   }
  //   console.log(token)
  // }, [tokenCookies]);

  return (
    <UserContext.Provider value={{ user, updateUserandToken, token, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
