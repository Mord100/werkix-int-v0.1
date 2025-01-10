import React from 'react';
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Login from "./pages/Login";
import ConsumerLayout from "./layouts/consumerLayout";
import AdminLayout from "./layouts/adminLayout";
import ProviderController from "./providers/ProviderController"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import SignUp from './pages/SignUp';

const PrivateRoute = ({ element, role }) => {
  const [cookies] = useCookies(['token', 'role']);
  return cookies.token && cookies.role === role ? element : <Navigate to="/login" />;
};

export default function App() {
  return (
    <ProviderController>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route 
            path="/consumer-layout" 
            element={<PrivateRoute element={<ConsumerLayout />} role="consumer" />} 
          />
          <Route 
            path="/admin-layout" 
            element={<PrivateRoute element={<AdminLayout />} role="admin" />} 
          />
        </Routes>
      </Router>
    </ProviderController>
  )
}