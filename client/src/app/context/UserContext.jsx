import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:8000/session', {
            headers: { Authorization: token }
          });
          if (response.data.loggedIn) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Session check failed:', error);
          setUser(null);
        }
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8000/login', { email, password });
      if (response.data.status === 'success') {
        localStorage.setItem('auth_token', response.data.auth_token);
        setUser(email);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error; // Rethrow the error to be caught by handleLogin
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
