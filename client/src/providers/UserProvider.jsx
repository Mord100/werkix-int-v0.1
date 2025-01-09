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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error.message);
      } finally {
        setLoading(false);
      }
    };
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

  const createUser = async (name, email, password, role) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/user', { name, email, password, role });
      
      setUsers([...users, response.data]);
      toast.success('User created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, name, email, password, role) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/api/user/${id}`, { name, email, password, role });
      
      setUsers(users.map(user => user._id === id ? response.data : user));
      toast.success('User updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, users, login, logout, createUser, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;