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
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session`, {
            headers: { Authorization: token }
          });
          if (response.data.loggedIn) {
            setUser({
              ID: response.data.user_ID,
              email: response.data.user_email
            });
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, { email, password });
      if (response.data.status === 'success') {
        localStorage.setItem('auth_token', response.data.auth_token);
        setUser({
          ID: response.data.user_ID,
          email: email
        })
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
    window.location.href = "/"
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
