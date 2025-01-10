import React, { useState, useContext, useEffect } from 'react';
import { 
  RiCheckLine, 
  RiTimeLine, 
  RiCalendar2Line,
  RiErrorWarningLine,
  RiArrowDownSLine 
} from 'react-icons/ri';
import FittingsContext from '../context/FittingsContext';
import { toast } from 'react-hot-toast';

const FittingProgress = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { fittings, currentFitting, setCurrentFitting } = useContext(FittingsContext);
  const [selectedFitting, setSelectedFitting] = useState(currentFitting);

  const STATUS_STAGES = [
    {
      key: 'Fitting Request Submitted',
      label: 'Request Submitted',
      icon: RiCheckLine,
      description: 'Your fitting request has been received and is being processed.'
    },
    {
      key: 'Fitting Being Prepped',
      label: 'Preparation',
      icon: RiTimeLine,
      description: 'Our team is preparing for your fitting session.'
    },
    {
      key: 'Fitting Scheduled',
      label: 'Scheduled',
      icon: RiCalendar2Line,
      description: 'Your fitting session has been scheduled.'
    },
    {
      key: 'Fitting Completed',
      label: 'Completed',
      icon: RiCheckLine,
      description: 'Your fitting session has been successfully completed.'
    },
    {
      key: 'Fitting Canceled',
      label: 'Canceled',
      icon: RiErrorWarningLine,
      description: 'Your fitting request has been canceled.'
    }
  ];

  // Use effect to update selected fitting when currentFitting changes
  useEffect(() => {
    setSelectedFitting(currentFitting);
  }, [currentFitting]);

  // Determine the current stage
  const getCurrentStage = () => {
    if (!selectedFitting) return 0;
    
    const currentStatusIndex = STATUS_STAGES.findIndex(
      stage => stage.key === selectedFitting.status
    );
    
    return currentStatusIndex !== -1 ? currentStatusIndex : 0;
  };

  // Handle fitting selection
  const handleFittingSelect = (fitting) => {
    setSelectedFitting(fitting);
    setCurrentFitting(fitting);
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-7xl my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      {/* Fitting Selector Dropdown */}
      <div className="relative mb-6">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-md"
        >
          <span className="text-md font-semibold">
            {selectedFitting 
              ? `${selectedFitting.type} - ${selectedFitting.status}` 
              : 'Select a Fitting'}
          </span>
          <RiArrowDownSLine className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {fittings.map((fitting) => (
              <div 
                key={fitting._id}
                onClick={() => handleFittingSelect(fitting)}
                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{fitting.type}</span>
                  <span className="text-sm text-gray-500 ml-2">{fitting.status}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {fitting.scheduledDate 
                    ? new Date(fitting.scheduledDate).toLocaleDateString()
                    : 'No date'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        Fitting Progress
      </h2>

      {/* Progress Stages */}
      <div className="space-y-4">
        {STATUS_STAGES.map((stage, index) => {
          const StageIcon = stage.icon;
          const isCompleted = index <= getCurrentStage();
          const isCurrent = index === getCurrentStage();

          return (
            <div 
              key={stage.key} 
              className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                isCompleted 
                  ? 'bg-blue-50 border-blue-200 border' 
                  : 'bg-gray-100 border-gray-200 border'
              }`}
            >
              <div 
                className={`w-8 h-8 mr-4 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                <StageIcon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className={`text-md font-semibold ${
                  isCompleted ? 'text-blue-800' : 'text-gray-600'
                }`}>
                  {stage.label}
                </h4>
                <p className="text-sm text-gray-600">{stage.description}</p>
                {isCurrent && (
                  <span className="text-xs text-yellow-600 font-medium">
                    Current Stage
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fitting Details */}
      {selectedFitting && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Fitting Details
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Type:</span>
              <p className="text-gray-800">{selectedFitting.type}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Scheduled Date:</span>
              <p className="text-gray-800">
                {selectedFitting.scheduledDate 
                  ? new Date(selectedFitting.scheduledDate).toLocaleDateString() 
                  : 'Not scheduled'}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Time:</span>
              <p className="text-gray-800">{selectedFitting.time || 'Not set'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Comments:</span>
              <p className="text-gray-800">
                {selectedFitting.comments || 'No additional comments'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex text-sm font-semibold justify-between">
        <button 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          onClick={() => {/* Handle cancel fitting */}}
        >
          Cancel Fitting
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => {/* Handle reschedule */}}
        >
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default FittingProgress;