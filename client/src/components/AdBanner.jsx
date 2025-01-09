import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const AdBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const promos = [
    {
      text: "Up to 20% Off: Golf Clubs from Top Brands",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      text: "Buy One Get One 20% Off: Golf Clubs", 
      gradient: "from-blue-500 to-teal-500"
    },
    {
      text: "Free Shipping on Golf Club Orders Over $500",
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promos.length) % promos.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto my-10 w-full md:w-[93%]">
      <div 
        className={`
          flex items-center justify-center 
          h-16 px-4 
          bg-gradient-to-r ${promos[currentSlide].gradient} 
          text-white 
          rounded-lg 
          shadow-lg 
          transform transition-all 
          hover:scale-[1.02] 
          hover:shadow-xl 
          animate-pulse 
          relative 
          overflow-hidden
        `}
      >
        {/* Shine effect */}
        <div 
          className="
            absolute 
            top-0 
            left-0 
            w-full 
            h-full 
            bg-white 
            opacity-20 
            animate-shine 
            pointer-events-none
          "
        />

        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 text-white hover:text-gray-200"
          aria-label="Previous promotion"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>

        {/* Promo Text */}
        <div className="text-center text-sm font-bold">
          {promos[currentSlide].text}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="absolute right-4 text-white hover:text-gray-200"
          aria-label="Next promotion"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all ${
              currentSlide === index ? 'w-4 bg-gray-900' : 'w-1 bg-gray-300'
            }`}
            aria-label={`Go to promotion ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom shine animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default AdBanner;