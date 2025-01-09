import React from 'react'
import { MdGolfCourse } from "react-icons/md";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <header className='border-b text-gray-900 py-4 px-20'>
        <div className='container mx-auto flex justify-between'>
            <h1 className='text-2xl flex gap-2 items-center font-bold'>
            <MdGolfCourse /> GolfClub <span className='text-2xl font-light text-gray-600'>Fitting</span>
            </h1>
            <Link to="/login" className='text-md text-gray-900 hover:text-gray-700 hover:underline'>
                Get Started
            </Link>
        </div>
    </header>
  )
}

export default Header