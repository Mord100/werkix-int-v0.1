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
import { VscDebugStart } from "react-icons/vsc";
import { FaTasks } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";






import { MdGolfCourse } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import UserContext from '../context/UserContext';
import Dashboard from '../components/Dashboard';
import ScheduleFitting from '../components/ScheduleFitting';
import FittingProgress from '../components/FittingProgress';
import AccountHistory from '../components/AccountHistory';
import MyProfile from '../components/MyProfile';
import GetStartedMessage from '../components/admin/GettingStartedMessage';
import FittingRequests from '../components/admin/FittingRequests';
import FittingsTasks from '../components/admin/FittingsTasks';
import FittingSchedule from '../components/admin/FittingSchedule';
import FittingHistory from '../components/admin/FittingHistory';
import CustomerProfiles from '../components/admin/CustomerProfiles';
import AdBanner from '../components/AdBanner';

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
  const [viewScheduleSwingAnalysis, setViewScheduleSwingAnalysis] = useState(false);
  const [viewGettingStarted, setViewGettingStarted] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleMenuItemClick = (item) => {
    setActiveItem(item.label);
    setViewHome(item.label === 'Home');
    setViewGettingStarted(item.label === 'Getting Started Message');
    setViewScheduleSwingAnalysis(item.label === 'Fitting Requests');
    setViewScheduleFitting(item.label === 'Fitting Tasks');
    setViewFittingProgress(item.label === 'Fitting Schedule');
    setViewFittingAccountHistory(item.label === 'Fitting History');
    setViewFittingMyProfile(item.label === 'Customer Profiles');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-1/5' : 'w-20'} bg-white h-full border-r border-gray-100`}>
        <div className="p-4 px-10 flex items-center justify-between border-b">
          <div className={`flex items-center ${!isSidebarOpen && 'hidden'}`}>
            <MdGolfCourse className="w-7 h-7 text-blue-700 mr-2" />
            <h1 className="font-semibold text-lg">Admin Portal</h1>
          </div>
        </div>

        <nav className="pl-10 text-sm font-semibold mt-6">
          {[
            { icon: RiDashboardLine, label: 'Home' },
            { icon: VscDebugStart, label: 'Getting Started Message' },
            { icon: MdListAlt, label: 'Fitting Requests' },
            { icon: FaTasks, label: 'Fitting Tasks' },
            { icon: GrScheduleNew, label: 'Fitting Schedule' },
            { icon: LuFileText, label: 'Fitting History' },
            { icon: FaUsersCog, label: 'Customer Profiles' },
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
          <div className="flex items-center border-b pr-10 justify-end px-6 py-4">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-800 hover:underline hover:text-gray-900"
            >
              <BiLogOut className="w-6 h-6 mr-2" />
              <span className="text-md">Logout</span>
            </button>
          </div>
          <div className="">
                <AdBanner />
            </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
        {viewHome ? (
            <Dashboard />
          ) : viewGettingStarted ? (
            <GetStartedMessage />
          ) : viewScheduleSwingAnalysis ? (
            <FittingRequests />
          ) : viewScheduleFitting ? (
            <FittingsTasks />
          ) : viewFittingProgress ? (
            <FittingSchedule />
          ) : viewFittingAccountHistory ? (
            <FittingHistory />
          ) : viewFittingMyProfile ? (
            <CustomerProfiles />
          ) : (
            <>
              <Dashboard />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;