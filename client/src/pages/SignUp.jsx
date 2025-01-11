import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiArrowLeftSLine } from 'react-icons/ri';
import UserContext from '../context/UserContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const { createUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createUser({
        name,
        email, 
        password,
        phone,
        address,
        role: 'consumer'
      });
      
      // Redirect to login page after successful signup
      navigate('/login');
    } catch (error) {
      // Error handling is done in the createUser method via toast
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-gray-100">
      <button
        onClick={() => navigate('/')}
        className="absolute top-0 left-0 m-8 hover:underline text-gray-900 flex gap-1 items-center text-left"
      >
        <RiArrowLeftSLine size={20} />
        Back
      </button>
      <div className="w-[50%] p-8 bg-white rounded-lg max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Please fill out the form to register
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="number" className="text-sm font-medium text-gray-700">Phone</label>
            <input
              id="number"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter Phone Number"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
            <input
              id="address"
              type="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter Address"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter password"
              required
              minLength="6"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account? {' '}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;