import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import axios from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('eduverify_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  

  const login = async (
    email: string,
    password: string
  ): Promise<"student" | "institution" | "verifier" | null> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/signIn`, { email, password });

      const { message, data } = response.data;

      if (message === "Sign-in successful" && data) {
        const {  role } = data;

        console.log(role);

        const userData: User = {
          id: data.id.toString(),
          email: data.email,
          role,
          name: data.email.split("@")[0],
          imageUrl: data.imageUrl
        };
        setUser(userData);

        localStorage.setItem("eduverify_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", data.token);
      
        if ( role === "student" || role === "institution" || role === "verifier" ) {
          return role;
        }
        return null;
      } else {
        console.error("Invalid login response");
        return null;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const handleAuthCallback = (data: any) => {
    if (data) {
      const { role } = data;
      
        const userData: User = {
          id: data.id.toString(),
          email: data.email,
          role,
          name: data.email.split("@")[0],
          imageUrl: data.imageUrl
        };
        setUser(userData);

        localStorage.setItem("eduverify_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", data.token);
      
        if ( role=== "student" || role === "institution" || role === "verifier" ) {
          return role;
        }
        return null;
  
    } else {
      console.error("Invalid user data received during authentication callback");
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eduverify_user');
  };

  const value = {
    user,
    login,
    handleAuthCallback,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

