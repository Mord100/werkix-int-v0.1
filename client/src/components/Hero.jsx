import React from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <div className="bg-gradient-to-r p-20 mx-20 mt-10 rounded-md from-blue-500 to-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Golf Club Fitting
          </h1>
          <p className="text-lg mb-6">
            Welcome to Golf Club Fitting - Your one-stop solution for all your golf needs. We offer a wide range of products and services to help you play better, stay healthier, and enjoy your time on the golf course.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </Link>
            <button className="border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner