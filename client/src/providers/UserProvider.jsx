import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import UserContext from '../context/UserContext';

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
      setUser(response.data.user); 
      setCookie('token', response.data.token); 
      return response.data; 
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null); 
    removeCookie('token'); 
  };

  return (
    <UserContext.Provider value={{ user, users, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;