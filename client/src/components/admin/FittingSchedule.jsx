import React, { useState, useContext, useEffect } from 'react';
import { 
  RiCalendar2Line, 
  RiAddLine, 
  RiFilterLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from 'react-icons/ri';
import FittingsContext from '../../context/FittingsContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

const FittingSchedule = () => {
  const { fittings, fetchFittings } = useContext(FittingsContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFitting, setSelectedFitting] = useState(null);
  const [filters, setFilters] = useState({
    status: [],
    type: []
  });

  // Fetch fittings when component mounts
  useEffect(() => {
    fetchFittings();
  }, []);

  // Prepare calendar days
  const calendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  // Filter fittings for the current month
  const filteredFittings = fittings.filter(fitting => {
    const fittingDate = new Date(fitting.scheduledDate);
    const isInMonth = 
      fittingDate.getMonth() === currentMonth.getMonth() && 
      fittingDate.getFullYear() === currentMonth.getFullYear();

    const statusMatch = filters.status.length === 0 || 
      filters.status.includes(fitting.status);
    
    const typeMatch = filters.type.length === 0 || 
      filters.type.includes(fitting.type);

    return isInMonth && statusMatch && typeMatch;
  });

  // Group fittings by date
  const fittingsByDate = filteredFittings.reduce((acc, fitting) => {
    const dateKey = format(new Date(fitting.scheduledDate), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(fitting);
    return acc;
  }, {});

  // Status color mapping
  const getStatusColor = (status) => {
    const colorMap = {
      'Fitting Request Submitted': 'bg-yellow-100 text-yellow-800',
      'Fitting Being Prepped': 'bg-blue-100 text-blue-800',
      'Fitting Scheduled': 'bg-green-100 text-green-800',
      'Fitting Completed': 'bg-purple-100 text-purple-800',
      'Fitting Canceled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  // Render calendar grid
  const renderCalendar = () => {
    const days = calendarDays();
    return (
      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-semibold text-gray-600">{day}</div>
        ))}
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayFittings = fittingsByDate[dateKey] || [];
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <div 
              key={day.toString()} 
              className={`
                border p-1 h-24 overflow-auto 
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              `}
            >
              <div className={`
                text-sm font-semibold mb-1
                ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
              `}>
                {format(day, 'd')}
              </div>
              {dayFittings.map(fitting => (
                <div 
                  key={fitting._id}
                  onClick={() => setSelectedFitting(fitting)}
                  className={`
                    text-xs p-1 rounded mb-1 cursor-pointer
                    ${getStatusColor(fitting.status)}
                  `}
                >
                  {fitting.customerName || 'Customer'} - {fitting.type}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  // Render selected fitting details
  const renderFittingDetails = () => {
    if (!selectedFitting) return null;

    return (
      <div className="bg-white border rounded-lg p-6 mt-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Fitting Details
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-gray-600">Customer:</span>
            <p className="text-gray-800">{selectedFitting.customerName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Type:</span>
            <p className="text-gray-800">{selectedFitting.type}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <p className={`
              inline-block px-2 py-1 rounded text-sm
              ${getStatusColor(selectedFitting.status)}
            `}>
              {selectedFitting.status}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Scheduled Date:</span>
            <p className="text-gray-800">
              {format(new Date(selectedFitting.scheduledDate), 'PPP')}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Time:</span>
            <p className="text-gray-800">{selectedFitting.time || 'Not specified'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Comments:</span>
            <p className="text-gray-800">{selectedFitting.comments || 'No comments'}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render filter options
  const renderFilterOptions = () => {
    const statusOptions = [
      'Fitting Request Submitted',
      'Fitting Being Prepped',
      'Fitting Scheduled',
      'Fitting Completed',
      'Fitting Canceled'
    ];

    const typeOptions = ['swing-analysis', 'club-fitting'];

    return (
      <div className="flex space-x-4 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-2">
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    status: prev.status.includes(status)
                      ? prev.status.filter(s => s !== status)
                      : [...prev.status, status]
                  }));
                }}
                className={`
                  px-3 py-1 rounded text-xs
                  ${filters.status.includes(status) 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'}
                `}
              >
                {status.replace('Fitting ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex space-x-2">
            {typeOptions.map(type => (
              <button
                key={type}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    type: prev.type.includes(type)
                      ? prev.type.filter(t => t !== type)
                      : [...prev.type, type]
                  }));
                }}
                className={`
                  px-3 py-1 rounded text-xs
                  ${filters.type.includes(type) 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700'}
                `}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <RiCalendar2Line className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Fitting Schedule
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <RiArrowLeftSLine />
            </button>
            <span className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button 
              onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <RiArrowRightSLine />
            </button>
          </div>
        </div>

        {/* Filters */}
        {renderFilterOptions()}

        {/* Calendar */}
        {renderCalendar()}

        {/* Selected Fitting Details */}
        {selectedFitting && renderFittingDetails()}
      </div>
    </div>
  );
};

export default FittingSchedule;