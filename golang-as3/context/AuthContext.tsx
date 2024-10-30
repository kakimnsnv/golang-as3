"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";


type User = {
  role: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem("jwt_token", token);
    const decoded: any = jwtDecode(token);
    setUser({role: decoded.userRole, token});
  };
  
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
  };

  useEffect(()=> {
    const token = localStorage.getItem("jwt_token");
    if (token) login(token);
  }, []);

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
