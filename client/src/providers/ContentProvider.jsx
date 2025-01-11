import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import ContentContext from '../context/ContentContext';

const ContentProvider = ({ children }) => {
  const [bannerContent, setBannerContent] = useState({
    title: 'Golf Club Fitting',
    description: 'Welcome to Golf Club Fitting - Your one-stop solution for all your golf needs. We offer a wide range of products and services to help you play better, stay healthier, and enjoy your time on the golf course.'
  });
  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(['token']);

  // axios instance with interceptors for authorization
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // request interceptor to include the token
  api.interceptors.request.use(
    (config) => {
      if (cookies.token) {
        config.headers['x-auth-token'] = cookies.token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Fetch Banner Content
  const getBannerContent = async () => {
    setLoading(true);
    try {
      const response = await api.get('/content/banner');
      setBannerContent(response.data);
      toast.success('Banner content loaded successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load banner content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update Banner Content
  const updateBannerContent = async (content) => {
    setLoading(true);
    try {
      const response = await api.put('/content/banner', content);
      setBannerContent(response.data);
      toast.success('Banner content updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update banner content');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch banner content on initial load
  useEffect(() => {
    getBannerContent();
  }, []);

  return (
    <ContentContext.Provider value={{ 
      bannerContent, 
      setBannerContent, 
      getBannerContent, 
      updateBannerContent,
      loading 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export default ContentProvider;