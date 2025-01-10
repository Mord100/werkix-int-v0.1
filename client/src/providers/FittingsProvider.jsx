import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import FittingsContext from '../context/FittingsContext';

const FittingsProvider = ({ children }) => {
  const [fittings, setFittings] = useState([]);
  const [currentFitting, setCurrentFitting] = useState(null);
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

 // Fetch all fittings
const fetchFittings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/fittings');
      const transformedFittings = response.data.map(fitting => ({
        ...fitting,
        scheduledDate: new Date(fitting.scheduledDate),
        formattedDate: new Date(fitting.scheduledDate).toLocaleDateString(),
        formattedTime: fitting.time
      }));
      setFittings(transformedFittings);
      toast.success('Fittings loaded successfully');
      return transformedFittings;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load fittings');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new fitting
  const createFitting = async (fittingData) => {
    setLoading(true);
    try {
      const response = await api.post('/fittings', fittingData);
      setFittings([...fittings, response.data]);
      toast.success('Fitting created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create fitting');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing fitting
  const updateFitting = async (id, fittingData) => {
    setLoading(true);
    try {
      const response = await api.put(`/fittings/${id}`, fittingData);
      setFittings(fittings.map(fitting => 
        fitting._id === id ? response.data : fitting
      ));
      toast.success('Fitting updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update fitting');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a fitting
  const deleteFitting = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/fittings/${id}`);
      setFittings(fittings.filter(fitting => fitting._id !== id));
      toast.success('Fitting deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete fitting');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // In FittingsProvider.jsx
const getFittingById = async (id) => {
    setLoading(true);
    try {
      if (!id) {
        throw new Error('Fitting ID is required');
      }
  
      const trimmedId = String(id).trim();
  
      const response = await api.get(`/fittings/${trimmedId}`);
      
      // Transform the fitting data 
      const transformedFitting = {
        ...response.data,
        scheduledDate: new Date(response.data.scheduledDate),
        formattedDate: new Date(response.data.scheduledDate).toLocaleDateString(),
        formattedTime: response.data.time
      };
  
      setCurrentFitting(transformedFitting);
      return transformedFitting;
    } catch (error) {
      console.error('Fitting Fetch Error:', error);
      
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch fitting'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Schedule a fitting
  const scheduleFitting = async (scheduleData) => {
    setLoading(true);
    try {
      const response = await api.post('/fittings/request', scheduleData);
      toast.success('Fitting scheduled successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule fitting');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch fittings on component mount
  useEffect(() => {
    if (cookies.token) {
      fetchFittings();
    }
  }, [cookies.token]);

  return (
    <FittingsContext.Provider value={{
      fittings,
      currentFitting,
      loading,
      fetchFittings,
      createFitting,
      updateFitting,
      deleteFitting,
      getFittingById,
      scheduleFitting,
      setCurrentFitting
    }}>
      {children}
    </FittingsContext.Provider>
  );
};

export default FittingsProvider;