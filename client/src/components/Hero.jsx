import React from 'react';
import { MdArrowForward, MdPhone, MdGolfCourse } from "react-icons/md";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative mx-4 mt-8 overflow-hidden rounded-xl lg:mx-20 lg:mt-10">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80"
          alt="Golf Course"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-gray-900/70" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-16 sm:px-12 lg:px-20">
        <div className="max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-sm">
            <MdGolfCourse className="mr-2 text-green-400" />
            Professional Fitting Services
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Perfect Your Game with Custom Club Fitting
            </h1>
            <p className="max-w-2xl text-lg text-gray-200">
              Experience the difference of professionally fitted golf clubs. Our expert fitting 
              service combines cutting-edge technology with years of expertise to help you achieve 
              your best performance on the course.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link to="/login">
              <button className="group inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-100">
                Get Started
                <MdArrowForward className="ml-2 h-4 w-4 transition transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12">
            {[
              { label: 'Satisfied Customers', value: '2000+' },
              { label: 'Years Experience', value: '15+' },
              { label: 'Club Brands', value: '20+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;