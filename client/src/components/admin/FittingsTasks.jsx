import React, { useState, useContext } from 'react';
import { 
  RiCheckLine, 
  RiCalendarCheckLine, 
  RiTimeLine, 
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiArrowDropDownLine
} from 'react-icons/ri';
import FittingsContext from '../../context/FittingsContext';
import { toast } from 'react-hot-toast';

// Status progression mapping
const STATUS_PROGRESSION = [
  'Fitting Request Submitted',
  'Fitting Request Acknowledged',
  'Swing Analysis Scheduled',
  'Swing Analysis Completed',
  'Fitting Scheduled',
  'Fitting Completed',
  'Fitting Canceled'
];

// Statuses that require a date
const STATUSES_REQUIRING_DATE = [
  'Swing Analysis Scheduled', 
  'Fitting Scheduled'
];

const FittingsTasks = () => {
  const { fittings, updateFitting } = useContext(FittingsContext);
  const [selectedFitting, setSelectedFitting] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle fitting selection
  const handleFittingSelect = (fitting) => {
    setSelectedFitting(fitting);
    setIsDropdownOpen(false);
  };

  // Handle status update
  const handleStatusUpdate = async (status) => {
    if (!selectedFitting) {
      toast.error('Please select a fitting first');
      return;
    }

    try {
      const updateData = {
        ...selectedFitting,
        status: status
      };

      // Add date for specific statuses
      if (STATUSES_REQUIRING_DATE.includes(status)) {
        // Ensure a valid date is sent
        const currentDate = new Date();
        updateData.scheduledDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
        updateData.date = currentDate.toISOString().split('T')[0]; // Duplicate for backend compatibility
      }

      const updatedFitting = await updateFitting(selectedFitting._id, updateData);
      
      toast.success(`Fitting status updated to ${status}`);
      
      // Update the selected fitting
      setSelectedFitting(updatedFitting);
    } catch (error) {
      toast.error('Failed to update fitting status');
      console.error(error);
    }
  };

  // Determine available next statuses
  const getAvailableStatuses = () => {
    if (!selectedFitting) return [];
    const currentIndex = STATUS_PROGRESSION.indexOf(selectedFitting.status);
    return STATUS_PROGRESSION.slice(currentIndex + 1);
  };

  // Status action buttons
  const renderStatusActions = () => {
    const availableStatuses = getAvailableStatuses();

    return availableStatuses.map((status) => {
      let icon, colorClass, bgColor;

      switch(status) {
        case 'Fitting Request Acknowledged':
          icon = <RiCheckLine />;
          colorClass = 'text-blue-600';
          bgColor = 'bg-blue-50';
          break;
        case 'Swing Analysis Scheduled':
          icon = <RiCalendarCheckLine />;
          colorClass = 'text-green-600';
          bgColor = 'bg-green-50';
          break;
        case 'Swing Analysis Completed':
          icon = <RiTimeLine />;
          colorClass = 'text-purple-600';
          bgColor = 'bg-purple-50';
          break;
        case 'Fitting Scheduled':
          icon = <RiCalendarCheckLine />;
          colorClass = 'text-teal-600';
          bgColor = 'bg-teal-50';
          break;
        case 'Fitting Completed':
          icon = <RiCheckLine />;
          colorClass = 'text-green-700';
          bgColor = 'bg-green-100';
          break;
        case 'Fitting Canceled':
          icon = <RiCloseCircleLine />;
          colorClass = 'text-red-600';
          bgColor = 'bg-red-50';
          break;
        default:
          icon = <RiErrorWarningLine />;
          colorClass = 'text-gray-600';
          bgColor = 'bg-gray-50';
      }

      return (
        <button
          key={status}
          onClick={() => handleStatusUpdate(status)}
          className={`
            flex items-center justify-start p-3 rounded-lg 
            ${bgColor} ${colorClass}
            hover:bg-opacity-80 transition-all duration-300 
            mb-2 w-full text-left font-medium
            border border-transparent hover:border-current
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
          `}
        >
          <span className="mr-3">{icon}</span>
          <span>{status}</span>
        </button>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Fitting Request Management
        </h2>
      </div>
      
      {/* Fitting Selection Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            w-full bg-gray-50 border border-gray-200 rounded-lg 
            px-4 py-3 text-left flex items-center justify-between
            hover:bg-gray-100 transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          `}
        >
          {selectedFitting 
            ? `${selectedFitting.customerName} - ${selectedFitting.type} Fitting` 
            : 'Select a Fitting Request'}
          <RiArrowDropDownLine className="text-2xl text-gray-500" />
        </button>

        {isDropdownOpen && (
          <div className={`
            absolute z-10 w-full mt-2 
            bg-white border border-gray-200 rounded-lg shadow-lg 
            max-h-60 overflow-y-auto
            divide-y divide-gray-100
          `}>
            {fittings.map((fitting) => (
              <div 
                key={fitting._id}
                onClick={() => handleFittingSelect(fitting)}
                className={`
                  px-4 py-3 cursor-pointer 
                  hover:bg-gray-50 
                  transition-colors duration-300
                  flex flex-col
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{fitting.customerName}</span>
                  <span className="text-sm text-gray-500">{fitting.type} Fitting</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{fitting.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedFitting && (
        <div className="space-y-6">
          <div className={`
            bg-gray-50 border border-gray-200 
            rounded-lg p-5 
            grid grid-cols-2 gap-4
          `}>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Customer Name
              </h3>
              <p className="text-gray-800 font-medium">
                {selectedFitting.customerName}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Fitting Type
              </h3>
              <p className="text-gray-800 font-medium">
                {selectedFitting.type}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Current Status
              </h3>
              <p className="text-gray-800 font-medium">
                {selectedFitting.status}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Available Status Updates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {renderStatusActions()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FittingsTasks;