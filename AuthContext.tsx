import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pin: string) => Promise<boolean>;
  register: (username: string, pin: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session
    const session = localStorage.getItem('fm_session_user');
    if (session) {
      setUser({ username: session });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pin: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 500));
    
    const users = JSON.parse(localStorage.getItem('fm_users') || '{}');
    if (users[username] && users[username] === pin) {
      setUser({ username });
      localStorage.setItem('fm_session_user', username);
      return true;
    }
    return false;
  };

  const register = async (username: string, pin: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 500));
    
    const users = JSON.parse(localStorage.getItem('fm_users') || '{}');
    if (users[username]) {
      return false; // User exists
    }
    
    users[username] = pin;
    localStorage.setItem('fm_users', JSON.stringify(users));
    
    // Auto login
    setUser({ username });
    localStorage.setItem('fm_session_user', username);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fm_session_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};