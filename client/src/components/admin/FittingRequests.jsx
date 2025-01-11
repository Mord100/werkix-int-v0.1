import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  RiFileListLine, 
  RiSearchLine, 
  RiArrowUpDownLine,
  RiCloseLine,
  RiFilterLine
} from 'react-icons/ri';
import { format, isValid, parseISO } from 'date-fns';
import FittingsContext from '../../context/FittingsContext';

const FittingRequests = () => {
  const { fittings } = useContext(FittingsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    type: [],
    dateRange: { start: null, end: null }
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  const [selectedFitting, setSelectedFitting] = useState(null);

  const safeFormatDate = (dateString) => {
    try {
      const parsedDate = typeof dateString === 'string' 
        ? parseISO(dateString) 
        : new Date(dateString);
      return isValid(parsedDate) 
        ? format(parsedDate, 'MMM d, yyyy') 
        : '—';
    } catch (error) {
      return '—';
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Fitting Request Submitted': 'bg-amber-50 text-amber-700 border border-amber-200',
      'Fitting Being Prepped': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Fitting Scheduled': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      'Fitting Completed': 'bg-violet-50 text-violet-700 border border-violet-200',
      'Fitting Canceled': 'bg-red-50 text-red-700 border border-red-200'
    };
    return colorMap[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const processedFittings = useMemo(() => {
    let result = [...fittings];

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(fitting => 
        fitting.customerName?.toLowerCase().includes(lowerSearchTerm) ||
        fitting.customerEmail?.toLowerCase().includes(lowerSearchTerm) ||
        fitting.customerPhone?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(fitting => filters.status.includes(fitting.status));
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter(fitting => {
        try {
          const fittingDate = new Date(fitting.createdAt);
          return fittingDate >= filters.dateRange.start && fittingDate <= filters.dateRange.end;
        } catch {
          return false;
        }
      });
    }

    // Sorting
    return result.sort((a, b) => {
      const dateA = new Date(a[sortConfig.key] || Date.now());
      const dateB = new Date(b[sortConfig.key] || Date.now());
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [fittings, searchTerm, filters, sortConfig]);

  const FilterButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${active 
          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
      `}
    >
      {label}
    </button>
  );

  const renderFilters = () => {
    const statusOptions = [
      'Fitting Request Submitted',
      'Fitting Being Prepped',
      'Fitting Scheduled',
      'Fitting Completed',
      'Fitting Canceled'
    ];

    return (
      <div className="bg-gray-50/50 p-4 rounded-lg mb-6 border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(status => (
                <FilterButton
                  key={status}
                  label={status.replace('Fitting ', '')}
                  active={filters.status.includes(status)}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFittingDetails = () => {
    if (!selectedFitting) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Fitting Request Details
            </h3>
            <button 
              onClick={() => setSelectedFitting(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RiCloseLine className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Customer Name</div>
                <div className="font-medium">{selectedFitting.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="font-medium">{selectedFitting.customerEmail}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="font-medium">{selectedFitting.customerPhone || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <span className={`
                  inline-block px-2.5 py-1 rounded-lg text-sm
                  ${getStatusColor(selectedFitting.status)}
                `}>
                  {selectedFitting.status.replace('Fitting ', '')}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Scheduled Date</div>
                <div className="font-medium">
                  {safeFormatDate(selectedFitting.scheduledDate) || '—'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Time</div>
                <div className="font-medium">
                  {selectedFitting.time || '—'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <RiFileListLine className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-semibold text-gray-800">
                  Fitting Requests
                </h1>
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
                    ${showFilters 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <RiFilterLine className="w-5 h-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {showFilters && renderFilters()}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      { key: 'customerName', label: 'Customer' },
                      { key: 'customerEmail', label: 'Email' },
                      { key: 'customerPhone', label: 'Phone' },
                      { key: 'scheduledDate', label: 'Date' },
                      { key: 'createdAt', label: 'Request Received' },
                      { key: 'status', label: 'Status' }
                    ].map(({ key, label }) => (
                      <th 
                        key={key}
                        onClick={() => {
                          setSortConfig(prev => ({
                            key,
                            direction: prev.key === key && prev.direction === 'asc' 
                              ? 'desc' 
                              : 'asc'
                          }));
                        }}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          <RiArrowUpDownLine 
                            className={`
                              w-4 h-4 text-gray-400
                              ${sortConfig.key === key ? 'text-blue-500' : ''}
                            `}
                          />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedFittings.map(fitting => (
                    <tr 
                      key={fitting._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {fitting.customerName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fitting.customerEmail}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {fitting.customerPhone || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {safeFormatDate(fitting.scheduledDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {safeFormatDate(fitting.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          inline-block px-2.5 py-1 rounded-lg text-sm
                          ${getStatusColor(fitting.status)}
                        `}>
                          {fitting.status.replace('Fitting ', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedFitting(fitting)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
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
                No fitting requests found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fitting Details Modal */}
      {selectedFitting && renderFittingDetails()}
    </div>
  );
};

export default FittingRequests;