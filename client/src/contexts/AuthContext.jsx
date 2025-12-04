import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from '../services/token';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(token ? decodeToken(token) : null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setUser(decodeToken(token));
      window.__AUTH_TOKEN__ = token; 
    } else {
      localStorage.removeItem('token');
      setUser(null);
      window.__AUTH_TOKEN__ = null;
    }
  }, [token]);

  const login = (tkn) => setToken(tkn);
  const logout = () => setToken(null);

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
