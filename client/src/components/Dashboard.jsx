import React from 'react';
import { 
  BiCalendar,
  BiBook,
  BiMessageRounded,
  BiLineChart,
  BiTrophy,
  BiGroup,
  BiTargetLock
} from 'react-icons/bi';
import { FaGolfBall } from "react-icons/fa";


const BentoBox = ({ title, text, icon: Icon, imageUrl, size = "normal" }) => {
  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 
      ${size === "large" ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'} 
      hover:shadow-xl`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

      <div className="relative h-full p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <Icon className="w-6 h-6 text-white/90" />
            <h3 className="text-xl font-medium text-white">{title}</h3>
          </div>
          <p className="text-white/80 font-light">
            {text}
          </p>
        </div>
        
        <div className="mt-auto pt-4">
          <button className="text-white/90 text-sm hover:text-white transition-colors duration-300">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="p-8 mx-5 max-w-7xl rounded-lg bg-white">
      <h1 className="text-3xl font-light mb-2 text-gray-900">Golf Club Fitting</h1>
      <p className="text-gray-500 mb-8">Custom fitting for your perfect game</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Featured Box */}
        <BentoBox
          title="Professional Fitting"
          text="State-of-the-art analysis for your perfect club match"
          icon={BiTargetLock}
          size="large"
          imageUrl="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80"
        />

        {/* Stats Box */}
        <BentoBox
          title="Performance Tracking"
          text="Monitor your progress with detailed analytics"
          icon={BiLineChart}
          imageUrl="https://images.unsplash.com/photo-1595875708571-854a3492c245?auto=format&fit=crop&q=80"
        />

        {/* Booking Box */}
        <BentoBox
          title="Schedule Fitting"
          text="Book your personalized session"
          icon={BiCalendar}
          imageUrl="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80"
        />

        {/* Equipment Box */}
        <BentoBox
          title="Premium Clubs"
          text="Explore our selection of elite equipment"
          icon={FaGolfBall}
          imageUrl="https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&q=80"
        />

        {/* Learning Box */}
        <BentoBox
          title="Expert Guidance"
          text="Learn from certified fitting specialists"
          icon={BiBook}
          imageUrl="https://images.unsplash.com/photo-1535132011086-b8818f016104?auto=format&fit=crop&q=80"
        />

        {/* Community Box */}
        <BentoBox
          title="Golf Community"
          text="Join fellow enthusiasts in your journey"
          icon={BiGroup}
          imageUrl="https://images.unsplash.com/photo-1561053720-76cd73ff22c3?auto=format&fit=crop&q=80"
        />

        {/* Success Stories */}
        <BentoBox
          title="Success Stories"
          text="See how proper fitting transformed players' games"
          icon={BiTrophy}
          size="large"
          imageUrl="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&q=80"
        />

        {/* Support Box */}
        <BentoBox
          title="Expert Support"
          text="Get assistance whenever you need"
          icon={BiMessageRounded}
          imageUrl="https://images.unsplash.com/photo-1560089168-6516081f5bf1?auto=format&fit=crop&q=80"
        />
      </div>
    </div>
  );
};

export default Dashboard;