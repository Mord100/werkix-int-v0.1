import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import ContentContext from '../context/ContentContext'
import { useEffect } from 'react'

const Banner = () => {
  const { bannerContent, getBannerContent } = useContext(ContentContext);

  useEffect(() => {
    getBannerContent();
  }, []);

  return (
    <div className="bg-gradient-to-r p-8 mx-5 mt-5 rounded-md from-blue-500 to-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-light mb-4">
            {bannerContent.title}
          </h1>
          <p className="text-lg mb-6">
            {bannerContent.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Banner;