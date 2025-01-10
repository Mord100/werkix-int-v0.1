import React, { useState, useContext, useEffect } from 'react';
import { 
  RiCheckLine, 
  RiTimeLine, 
  RiCalendar2Line,
  RiErrorWarningLine,
  RiFilterLine,
  RiSearchLine
} from 'react-icons/ri';
import FittingsContext from '../../context/FittingsContext';
import { toast } from 'react-hot-toast';

const FittingRequests = () => {
  const { fittings } = useContext(FittingsContext);
  const [filteredFittings, setFilteredFittings] = useState(fittings);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('createdAt');
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

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(fitting => 
        fitting.customerName.toLowerCase().includes(searchTermLower) ||
        fitting.customerEmail.toLowerCase().includes(searchTermLower) ||
        fitting.customerPhone.toLowerCase().includes(searchTermLower)
      );
    }

    // Sort by selected column
    result.sort((a, b) => {
      let valueA, valueB;
      switch(sortColumn) {
        case 'customerName':
          valueA = a.customerName;
          valueB = b.customerName;
          break;
        case 'scheduledDate':
          valueA = new Date(a.scheduledDate || a.createdAt);
          valueB = new Date(b.scheduledDate || b.createdAt);
          break;
        default:
          valueA = new Date(a.createdAt);
          valueB = new Date(b.createdAt);
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredFittings(result);
  }, [fittings, filterStatus, searchTerm, sortColumn, sortOrder]);

  // Render status with color
  const renderStatus = (status) => {
    const statusColor = STATUS_COLORS[status] || 'text-gray-600';
    return <span className={`${statusColor} font-medium`}>{status}</span>;
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-full my-5 mx-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Fitting Requests Management
        </h2>
        
        {/* Filters and Search */}
        <div className="flex space-x-4 items-center">
          {/* Search Input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm w-64"
            />
            <RiSearchLine className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Status Filter */}
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
        </div>
      </div>

      {/* Fittings Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('customerName')}
              >
                Customer Name 
                {sortColumn === 'customerName' && 
                  (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('scheduledDate')}
              >
                Scheduled Date
                {sortColumn === 'scheduledDate' && 
                  (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Request Received
                {sortColumn === 'createdAt' && 
                  (sortOrder === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFittings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No fitting requests found
                </td>
              </tr>
            ) : (
              filteredFittings.map((fitting) => (
                <tr 
                  key={fitting._id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm text-gray-900">
                    {fitting.customerName}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {fitting.customerEmail}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {fitting.customerPhone}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {fitting.scheduledDate 
                      ? new Date(fitting.scheduledDate).toLocaleDateString() 
                      : 'Not Scheduled'}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {fitting.time || 'Not Set'}
                  </td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(fitting.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 text-sm">
                    {renderStatus(fitting.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FittingRequests;