'use client';  // This tells Next.js that this is a client component

import { createContext, useState, useEffect } from 'react';

// Create an AuthContext
export const AuthContext = createContext();

// Create an AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (for example, by checking a cookie or local storage)
    const token = document.cookie.split(";").find(c => c.trim().startsWith("auth_token="));
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Define logout function
  const logout = () => {
    // Remove authentication token (for example, clear the cookie)
    document.cookie = "auth_token=; max-age=0; path=/";
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
