// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added state for error handling

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking authentication', error);
        setError('Failed to check authentication'); // Set error state
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // No dependencies needed here

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed'); // Set error state
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
