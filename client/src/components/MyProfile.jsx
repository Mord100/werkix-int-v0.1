import React, { useState, useContext, useEffect } from 'react';
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine,
  RiMapPinLine,
  RiEditLine,
  RiSaveLine
} from 'react-icons/ri';
import { FaGolfBall } from "react-icons/fa";

import UserContext from '../context/UserContext';
import { toast } from 'react-hot-toast';

const MyProfile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    golfClubSize: ''
  });

  // Golf Club Size Options
  const GOLF_CLUB_SIZES = [
    'Junior',
    'Standard',
    'Tall',
    'Custom'
  ];

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
        golfClubSize: user.profile?.golfClubSize || ''
      });
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await updateUser(user.id, {
        name: profileData.name,
        profile: {
          phone: profileData.phone,
          address: profileData.address,
          golfClubSize: profileData.golfClubSize
        }
      });
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  // Render input field with icon
  const renderInputField = (icon, name, label, type = 'text') => {
    const Icon = icon;
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400" />
          </div>
          <input
            type={type}
            name={name}
            value={profileData[name]}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`pl-10 p-2 block w-full rounded-md border ${
              isEditing 
                ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                : 'border-transparent bg-gray-100'
            }`}
          />
        </div>
      </div>
    );
  };

  // Don't render if no user is logged in
  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="max-w-7xl my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-b pb-4 justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          My Profile
        </h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center px-4 py-2 rounded-md ${
            isEditing 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          {isEditing ? (
            <>
              <RiSaveLine className="mr-2" /> Save Profile
            </>
          ) : (
            <>
              <RiEditLine className="mr-2" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Personal Information
          </h3>
          {renderInputField(RiUserLine, 'name', 'Full Name')}
          {renderInputField(RiMailLine, 'email', 'Email', 'email')}
          {renderInputField(RiPhoneLine, 'phone', 'Phone Number', 'tel')}
        </div>

        {/* Address and Golf Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Additional Details
          </h3>
          {renderInputField(RiMapPinLine, 'address', 'Address')}
          
          {/* Golf Club Size Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Golf Club Size
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGolfBall className="text-gray-400" />
              </div>
              <select
                name="golfClubSize"
                value={profileData.golfClubSize}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`pl-10 p-2 block w-full rounded-md border ${
                  isEditing 
                    ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-transparent bg-gray-100'
                }`}
              >
                <option value="">Select Club Size</option>
                {GOLF_CLUB_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={() => setIsEditing(false)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;