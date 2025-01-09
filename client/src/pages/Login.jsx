import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UserContext from '../context/UserContext';
import { RiArrowLeftSLine } from 'react-icons/ri';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await login(email, password);
      
      // Navigate based on user role
      if (response.user.role === 'admin') {
        navigate('/admin-layout');
      } else if (response.user.role === 'consumer') {
        navigate('/consumer-layout');
      } else {
        // Fallback route if role is unexpected
        navigate('/');
        toast.error('Unknown user role');
      }
    } catch (error) {
      // Error handling is already done in the login function
      toast.error('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => navigate('/')}
        className="absolute top-0 left-0 m-8 hover:underline text-gray-900 flex gap-1 items-center text-left"
      >
        <RiArrowLeftSLine size={20} />
        Back
      </button>
      <div className="w-[50%] p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Login
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Please enter your email and password to access the dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;