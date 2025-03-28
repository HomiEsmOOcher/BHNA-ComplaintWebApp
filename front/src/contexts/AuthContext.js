import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Load from localStorage on page reload
    const savedData = localStorage.getItem("authData");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    // Save authData to localStorage whenever it changes
    if (authData) {
      localStorage.setItem("authData", JSON.stringify(authData));
    }
  }, [authData]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};
