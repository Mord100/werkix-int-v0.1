import React from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <div className="bg-gradient-to-r p-16 mx-5 mt-5 rounded-md from-blue-500 to-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Golf Club Fitting
          </h1>
          <p className="text-lg mb-6">
            Welcome to Golf Club Fitting - Your one-stop solution for all your golf needs. We offer a wide range of products and services to help you play better, stay healthier, and enjoy your time on the golf course.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Banner