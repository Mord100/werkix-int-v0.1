import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import UserContext from '../context/UserContext';
import { toast } from 'react-hot-toast';

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'role']); // Use cookies for token and role storage

  // Create axios instance with interceptors
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor to add token to every request
  api.interceptors.request.use(
    (config) => {
      if (cookies.token) {
        config.headers['Authorization'] = `Bearer ${cookies.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check if token exists in cookies and set user state accordingly
    if (cookies.token) {
      setUser({ 
        token: cookies.token,
        role: cookies.role 
      });
    }
  }, [cookies.token, cookies.role]);

  // Fetch Users Method (Admin only)
  const fetchUsers = async () => {
    // Check if user is an admin using cookie role
    if (cookies.role !== 'admin') {
      toast.error('Access denied. Admin rights required.');
      return [];
    }

    setLoading(true);
    try {
      const response = await api.get('/user');
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on provider mount (only for admin)
  useEffect(() => {
    if (cookies.role === 'admin') {
      fetchUsers();
    }
  }, [cookies.role, cookies.token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/user/login', { email, password });
      
      // Set token and role in cookies
      setCookie('token', response.data.token, { path: '/' });
      setCookie('role', response.data.user.role, { path: '/' });
      
      setUser(response.data.user);
      toast.success('Login successful');
      
      return response.data; // Return full response for role-based navigation
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    removeCookie('token', { path: '/' });
    removeCookie('role', { path: '/' });
    setUser(null);
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/user', userData);
      
      setUsers([...users, response.data]);
      toast.success('User created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const response = await api.put(`/user/${id}`, userData);
      
      setUsers(users.map(user => user._id === id ? response.data : user));
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/user/${id}`);
      
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      createUser, 
      updateUser, 
      deleteUser,
      fetchUsers, 
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;