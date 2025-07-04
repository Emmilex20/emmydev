/* eslint-disable react-refresh/only-export-components */
// packages/frontend/src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // <-- Corrected type import
import { setAuthToken } from '../services/api'; // Import the helper to set Axios default header

interface AuthContextType {
  isAdminAuthenticated: boolean;
  login: (apiKey: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check localStorage for a stored API key on initial load
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const storedApiKey = localStorage.getItem('adminApiKey');
    if (storedApiKey) {
      // Set the token for Axios immediately if found
      setAuthToken(storedApiKey);
      return true; // Assume authenticated if key is present (backend will verify on first protected call)
    }
    return false;
  });

  const login = (apiKey: string) => {
    localStorage.setItem('adminApiKey', apiKey);
    setAuthToken(apiKey); // Set the API key for all future Axios requests
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminApiKey');
    setAuthToken(''); // Clear the API key from Axios headers
    setIsAdminAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};