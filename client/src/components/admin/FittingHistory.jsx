import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  RiFileListLine, 
  RiFilterLine, 
  RiSearchLine, 
  RiArrowUpDownLine 
} from 'react-icons/ri';
import { format, isValid, parseISO } from 'date-fns';

import FittingsContext from '../../context/FittingsContext';

const FittingHistory = () => {
  const { fittings, fetchFittings } = useContext(FittingsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    dateRange: { start: null, end: null }
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'scheduledDate',
    direction: 'desc'
  });
  const [selectedFitting, setSelectedFitting] = useState(null);

  // Safe date formatting
  const safeFormatDate = (dateString) => {
    try {
      const parsedDate = typeof dateString === 'string' 
        ? parseISO(dateString) 
        : new Date(dateString);
      
      return isValid(parsedDate) 
        ? format(parsedDate, 'PP') 
        : 'Invalid Date';
    } catch (error) {
      console.warn('Date parsing error:', error);
      return 'Unknown Date';
    }
  };

  // Fetch fittings on component mount
  useEffect(() => {
    fetchFittings();
  }, []);

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

  // Filtered and sorted fittings
  const processedFittings = useMemo(() => {
    let result = fittings;

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(fitting => 
        fitting.customerName?.toLowerCase().includes(lowerSearchTerm) ||
        fitting.type?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(fitting => 
        filters.status.includes(fitting.status)
      );
    }

    // Type filter
    if (filters.type.length > 0) {
      result = result.filter(fitting => 
        filters.type.includes(fitting.type)
      );
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(fitting => {
        try {
          const fittingDate = new Date(fitting.scheduledDate);
          return (
            fittingDate >= filters.dateRange.start && 
            fittingDate <= filters.dateRange.end
          );
        } catch {
          return false;
        }
      });
    }

    // Sorting with fallback
    return result.sort((a, b) => {
      const dateA = new Date(a.scheduledDate || Date.now());
      const dateB = new Date(b.scheduledDate || Date.now());
      
      if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [fittings, searchTerm, filters, sortConfig]);

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
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
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
          <div className="flex gap-2">
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

        {/* Date Range Filter */}
        {/*  */}
      </div>
    );
  };

  // Render detailed fitting modal
  const renderFittingDetails = () => {
    if (!selectedFitting) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Fitting Details
            </h3>
            <button 
              onClick={() => setSelectedFitting(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
          
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
                {safeFormatDate(selectedFitting.scheduledDate)}
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

          {/* Additional Measurements or Details */}
          {selectedFitting.measurements && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Measurements</h4>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(selectedFitting.measurements, null, 2)}
              </pre>
            </div>
          )}
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
            <RiFileListLine className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Fitting History
            </h2>
          </div>
          
          {/* Search Input */}
          <div className="relative flex-grow max-w-md ml-auto mr-4">
            <input 
              type="text"
              placeholder="Search fittings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <RiSearchLine className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        {renderFilterOptions()}

        {/* Fittings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 uppercase">
              <tr>
                {[
                  { key: 'customerName', label: 'Customer' },
                  { key: 'type', label: 'Type' },
                  { key: 'status', label: 'Status' },
                  { key: 'scheduledDate', label: 'Scheduled Date' },
                  { key: 'time', label: 'Time' }
                ].map(({ key, label }) => (
                  <th 
                    key={key} 
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => {
                      setSortConfig(prev => ({
                        key,
                        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
                      }));
                    }}
                  >
                    <div className="flex items-center">
                      {label}
                      <RiArrowUpDownLine className="ml-2 text-gray-400" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedFittings.map(fitting => (
                <tr 
                  key={fitting._id} 
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">{fitting.customerName}</td>
                  <td className="px-4 py-3">{fitting.type}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`
                        inline-block px-2 py-1 rounded text-xs
                        ${getStatusColor(fitting.status)}
                      `}
                    >
                      {fitting.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {safeFormatDate(fitting.scheduledDate)}
                  </td>
                  <td className="px-4 py-3">{fitting.time || 'Not set'}</td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => setSelectedFitting(fitting)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {processedFittings.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No fittings found matching your criteria.
          </div>
        )}
      </div>

      {/* Fitting Details Modal */}
      {selectedFitting && renderFittingDetails()}
    </div>
  );
};

export default FittingHistory;