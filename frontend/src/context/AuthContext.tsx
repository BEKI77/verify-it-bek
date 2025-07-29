import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mockUsers: Record<string, User> = {
  'student@example.com': {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    faydaId: 'FYD-STU-001',
    role: 'student',
    schoolName: 'Delhi Public School',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  'institution@example.com': {
    id: '2',
    name: 'Delhi Public School',
    email: 'institution@example.com',
    faydaId: 'FYD-INS-001',
    role: 'institution',
    contactInfo: '+91 98765 43210',
    institutionLogo: 'https://images.pexels.com/photos/1586996/pexels-photo-1586996.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  'verifier@example.com': {
    id: '3',
    name: 'Tech Corp HR',
    email: 'verifier@example.com',
    faydaId: 'FYD-VER-001',
    role: 'verifier'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('eduverify_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  

  const login = (email: string, role: User['role']) => {
    const userData = mockUsers[email];
    if (userData && userData.role === role) {
      setUser(userData);
      localStorage.setItem('eduverify_user', JSON.stringify(userData));
    }
  };

  const handleAuthCallback = (code: string) => {
    console.log(`CODE :  ${code}`);
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