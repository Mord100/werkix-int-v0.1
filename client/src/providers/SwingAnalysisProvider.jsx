import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCookies } from 'react-cookie';
import SwingAnalysisContext from '../context/SwingAnalysisContext';

const SwingAnalysisProvider = ({ children }) => {
  const [swingAnalyses, setSwingAnalyses] = useState([]);
  const [currentSwingAnalysis, setCurrentSwingAnalysis] = useState(null);
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

// Fetch all swing analyses for the current user
const fetchSwingAnalyses = async () => {
    setLoading(true);
    try {
      // Use a more specific route for fetching user's swing analyses
      const response = await api.get('/fittings', {
        params: {
          type: 'swing-analysis'
        }
      });
      
      setSwingAnalyses(response.data);
      toast.success('Swing Analyses loaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load swing analyses');
    } finally {
      setLoading(false);
    }
  };

  // Schedule a swing analysis
  const scheduleSwingAnalysis = async (analysisData) => {
    setLoading(true);
    try {
      // Prepare data for scheduling using schedule routes
      const swingAnalysisData = {
        date: analysisData.date, // ISO date string
        timeSlotId: analysisData.timeSlotId, // MongoDB ID of the time slot
        serviceType: 'swing-analysis'
      };
  
      const response = await api.post('/schedule/book', swingAnalysisData);
      
      // Update local state
      setSwingAnalyses([...swingAnalyses, response.data]);
      
      toast.success('Swing Analysis scheduled successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule swing analysis');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available time slots
  const getAvailableTimeSlots = async (date) => {
    try {
      const response = await api.get('/schedule/availability', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch available time slots');
      throw error;
    }
  };
  
  // Fetch calendar information
  const getCalendar = async () => {
    try {
      const response = await api.get('/schedule/calendar');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch calendar');
      throw error;
    }
  };

// Get a single swing analysis by ID
const getSwingAnalysisById = async (id) => {
    setLoading(true);
    try {
      // Ensure id is a valid MongoDB ObjectId
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid swing analysis ID');
      }
  
      const response = await api.get(`/fittings/${id}`);
      
      // Verify it's a swing analysis
      if (response.data.type !== 'swing-analysis') {
        throw new Error('Not a swing analysis fitting');
      }
      
      setCurrentSwingAnalysis(response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch swing analysis');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Update swing analysis measurements
const updateSwingAnalysisMeasurements = async (id, measurementData) => {
    setLoading(true);
    try {
      // Ensure id is a valid MongoDB ObjectId
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid swing analysis ID');
      }
  
      const response = await api.put(`/fittings/${id}/measurements`, {
        measurements: measurementData
      });
      
      // Update local state
      setSwingAnalyses(swingAnalyses.map(analysis => 
        analysis._id === id ? response.data : analysis
      ));
      
      toast.success('Swing Analysis measurements updated');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update measurements');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel a swing analysis
  const cancelSwingAnalysis = async (id) => {
    setLoading(true);
    try {
      // Ensure id is a valid MongoDB ObjectId
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid swing analysis ID');
      }
  
      const response = await api.put(`/fittings/${id}/cancel`);
      
      // Update local state
      setSwingAnalyses(swingAnalyses.map(analysis => 
        analysis._id === id ? response.data : analysis
      ));
      
      toast.success('Swing Analysis canceled');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel swing analysis');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch swing analyses on component mount
  useEffect(() => {
    if (cookies.token) {
      fetchSwingAnalyses();
    }
  }, [cookies.token]);

  return (
    <SwingAnalysisContext.Provider value={{
      swingAnalyses,
      currentSwingAnalysis,
      loading,
      fetchSwingAnalyses,
      scheduleSwingAnalysis,
      getSwingAnalysisById,
      updateSwingAnalysisMeasurements,
      cancelSwingAnalysis,
      setCurrentSwingAnalysis,
      getAvailableTimeSlots,
      getCalendar
    }}>
      {children}
    </SwingAnalysisContext.Provider>
  );
};

export default SwingAnalysisProvider;