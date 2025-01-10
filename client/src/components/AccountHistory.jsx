import React, { useState, useContext, useEffect } from 'react';
import { 
  RiCheckLine, 
  RiTimeLine, 
  RiCalendar2Line,
  RiErrorWarningLine,
  RiFilterLine
} from 'react-icons/ri';
import FittingsContext from '../context/FittingsContext';
import { toast } from 'react-hot-toast';

const AccountHistory = () => {
  const { fittings } = useContext(FittingsContext);
  const [filteredFittings, setFilteredFittings] = useState(fittings);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');

  // Status filter options
  const STATUS_OPTIONS = [
    'All',
    'Fitting Request Submitted',
    'Fitting Being Prepped',
    'Fitting Scheduled',
    'Fitting Completed',
    'Fitting Canceled'
  ];

  // Status icons mapping
  const STATUS_ICONS = {
    'Fitting Request Submitted': RiCheckLine,
    'Fitting Being Prepped': RiTimeLine,
    'Fitting Scheduled': RiCalendar2Line,
    'Fitting Completed': RiCheckLine,
    'Fitting Canceled': RiErrorWarningLine
  };

  // Status color mapping
  const STATUS_COLORS = {
    'Fitting Request Submitted': 'text-blue-600',
    'Fitting Being Prepped': 'text-yellow-600',
    'Fitting Scheduled': 'text-green-600',
    'Fitting Completed': 'text-green-800',
    'Fitting Canceled': 'text-red-600'
  };

  // Filter and sort fittings
  useEffect(() => {
    let result = [...fittings];

    // Filter by status
    if (filterStatus !== 'All') {
      result = result.filter(fitting => fitting.status === filterStatus);
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.scheduledDate || a.createdAt);
      const dateB = new Date(b.scheduledDate || b.createdAt);
      return sortOrder === 'desc' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredFittings(result);
  }, [fittings, filterStatus, sortOrder]);

  // Render fitting status with icon
  const renderStatusWithIcon = (status) => {
    const StatusIcon = STATUS_ICONS[status] || RiCheckLine;
    const statusColor = STATUS_COLORS[status] || 'text-gray-600';

    return (
      <div className="flex items-center">
        <StatusIcon className={`mr-2 ${statusColor}`} />
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Account Fitting History
        </h2>
        
        {/* Filters */}
        <div className="flex space-x-4">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm"
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <RiFilterLine className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
          </div>

          {/* Sort Order */}
          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm flex items-center"
          >
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Fittings List */}
      <div className="space-y-4">
        {filteredFittings.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            No fittings found
          </div>
        ) : (
          filteredFittings.map((fitting) => (
            <div 
              key={fitting._id} 
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    {fitting.type} Fitting
                  </h3>
                  {renderStatusWithIcon(fitting.status)}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {fitting.scheduledDate 
                      ? `Scheduled: ${new Date(fitting.scheduledDate).toLocaleDateString()}`
                      : 'Date Not Set'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {fitting.time || 'Time Not Set'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountHistory;