import React, { useState, useContext } from 'react';
import { 
  RiDashboardLine, 
  RiUserHeartLine,
  RiCalendarEventLine,
  RiDropLine,
  RiHospitalLine,
  RiSettings2Line,
  RiUser3Line,
} from 'react-icons/ri';
import { LuFileText } from "react-icons/lu";
import { GrScheduleNew } from "react-icons/gr";
import { MdTimeline } from "react-icons/md";



import { MdGolfCourse } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import UserContext from '../context/UserContext';

const MenuItem = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 text-md ${
      active ? 'bg-blue-50 text-blue-700 my-3 border-r-2 rounded-l-lg border-blue-700' : 'text-gray-600 my-3 rounded-l-lg hover:bg-gray-50'
    }`}
  >
    <Icon className="w-6 h-6 mr-3" />
    <span>{label}</span>
  </button>
);



const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { logout } = useContext(UserContext);
  const [viewHome, setViewHome] = useState(false);
  const [viewScheduleFitting, setViewScheduleFitting] = useState(false);
  const [viewFittingProgress, setViewFittingProgress] = useState(false);
  const [viewFittingAccountHistory, setViewFittingAccountHistory] = useState(false);
  const [viewFittingMyProfile, setViewFittingMyProfile] = useState(false);
  const [viewFittingSettings, setViewFittingSettings] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleMenuItemClick = (item) => {
    setActiveItem(item.label);
    setViewHome(item.label === 'Home');
    setViewScheduleFitting(item.label === 'Schedule a Fitting');
    setViewFittingProgress(item.label === 'Fitting Progress');
    setViewFittingAccountHistory(item.label === 'Account History');
    setViewFittingMyProfile(item.label === 'My Profile');
    setViewFittingSettings(item.label === 'Settings');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-1/5' : 'w-20'} bg-white h-full border-r border-gray-100`}>
        <div className="p-4 px-10 flex items-center justify-between border-b">
          <div className={`flex items-center ${!isSidebarOpen && 'hidden'}`}>
            <MdGolfCourse className="w-7 h-7 text-gray-900 mr-2" />
            <h1 className="font-semibold text-lg">GolfClub Fitting</h1>
          </div>
        </div>

        <nav className="pl-10 font-semibold mt-6">
          {[
            { icon: RiDashboardLine, label: 'Home' },
            { icon: RiCalendarEventLine, label: 'Schedule a Swing Analysis' },
            { icon: GrScheduleNew, label: 'Schedule a Fitting' },
            { icon: MdTimeline, label: 'Fitting Progress' },
            { icon: LuFileText, label: 'Account History' },
            { icon: RiUser3Line, label: 'My Profile' },
            { icon: RiSettings2Line, label: 'Settings' },
          ].map((item) => (
            <MenuItem
              key={item.label}
              {...item}
              active={activeItem === item.label}
              onClick={() => handleMenuItemClick(item)}
            />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-100">
          <div className="flex items-center pr-10 justify-end px-6 py-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-800 hover:underline hover:text-gray-900"
            >
              <BiLogOut className="w-6 h-6 mr-2" />
              <span className="text-md">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          
        </main>
      </div>
    </div>
  );
};

export default Admin;