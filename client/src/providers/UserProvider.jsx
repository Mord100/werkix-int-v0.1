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
  const [cookies, setCookie, removeCookie] = useCookies(['token']); // Use cookies for token storage

  useEffect(() => {
    // Check if token exists in cookies and set user state accordingly
    if (cookies.token) {
      setUser({ token: cookies.token });
    }
  }, [cookies.token]);

  // Fetch Users Method
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on provider mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', { email, password });
      
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
      const response = await axios.post('http://localhost:3000/api/user', userData);
      
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
      const response = await axios.put(`http://localhost:3000/api/user/${id}`, userData);
      
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
      await axios.delete(`http://localhost:3000/api/user/${id}`);
      
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