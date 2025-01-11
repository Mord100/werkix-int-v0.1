import React, { useState, useContext, useEffect } from 'react';
import { RiEditLine, RiSaveLine, RiCloseLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import ContentContext from '../../context/ContentContext';

const GettingStartedMessage = () => {
  const { 
    bannerContent: contextBannerContent, 
    updateBannerContent, 
    getBannerContent,
    loading 
  } = useContext(ContentContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [bannerContent, setBannerContent] = useState({
    title: 'Golf Club Fitting',
    description: 'Welcome to Golf Club Fitting - Your one-stop solution for all your golf needs. We offer a wide range of products and services to help you play better, stay healthier, and enjoy your time on the golf course.'
  });

  // Sync local state with context
  useEffect(() => {
    setBannerContent(contextBannerContent);
  }, [contextBannerContent]);

  // Fetch existing banner content on component mount
  useEffect(() => {
    const fetchBannerContent = async () => {
      try {
        await getBannerContent();
      } catch (error) {
        console.error('Failed to fetch banner content:', error);
      }
    };

    fetchBannerContent();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save banner content
  const handleSaveBanner = async () => {
    try {
      await updateBannerContent(bannerContent);
      toast.success('Banner content updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update banner content');
      console.error('Banner update error:', error);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setBannerContent(contextBannerContent);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Getting Started Message
        </h2>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200"
              disabled={loading}
            >
              <RiEditLine className="mr-2" /> Edit Banner
            </button>
          ) : (
            <>
              <button 
                onClick={handleCancelEdit}
                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                disabled={loading}
              >
                <RiCloseLine className="mr-2" /> Cancel
              </button>
              <button 
                onClick={handleSaveBanner}
                className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-md hover:bg-green-200"
                disabled={loading}
              >
                <RiSaveLine className="mr-2" /> Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r p-8 rounded-md from-blue-500 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={bannerContent.title}
                  onChange={handleInputChange}
                  placeholder="Enter banner title"
                  className="w-full text-4xl font-light mb-4 bg-transparent border-b border-white/50 focus:outline-none"
                  disabled={loading}
                />
                <textarea
                  name="description"
                  value={bannerContent.description}
                  onChange={handleInputChange}
                  placeholder="Enter banner description"
                  className="w-full text-lg mb-6 bg-transparent border border-white/50 rounded-md p-2 focus:outline-none"
                  rows="4"
                  disabled={loading}
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-light mb-4">
                  {bannerContent.title}
                </h1>
                <p className="text-lg mb-6">
                  {bannerContent.description}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStartedMessage;