import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing (optional - you can remove if not needed)
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'priest@church.com',
    password: 'password123',
    user: {
      id: '1',
      email: 'priest@church.com',
      name: 'Father John',
      role: 'priest',
    },
  },
  {
    email: 'admin@church.com',
    password: 'admin123',
    user: {
      id: '2',
      email: 'admin@church.com',
      name: 'Sister Mary',
      role: 'admin',
    },
  },
];

// Helper function to generate unique ID
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate inputs
      if (!email || !password) {
        return false;
      }

      // Check for demo users first (optional)
      const demoUser = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (demoUser) {
        setUser(demoUser.user);
        return true;
      }

      // Allow any email/password for development
      // Remove this block in production and add real authentication
      const userName = email
        .split('@')[0]
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const newUser: User = {
        id: generateId(),
        email: email,
        name: userName,
        role: 'priest',
      };

      setUser(newUser);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      // This ALWAYS runs, ensuring isLoading is reset
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}