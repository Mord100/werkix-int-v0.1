import React, { useState, useContext, useEffect, useMemo } from 'react';
import { 
  RiUserLine, 
  RiEditLine, 
  RiSearchLine, 
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiArrowUpDownLine
} from 'react-icons/ri';
import UserContext from '../../context/UserContext';

const CustomerProfiles = () => {
  const { users, fetchUsers, updateUser, deleteUser, createUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    golfClubSize: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processedUsers = useMemo(() => {
    let result = [...users];

    // Search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(lowerSearchTerm) ||
        user.email?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Sorting
    return result.sort((a, b) => {
      const valueA = a[sortConfig.key] || '';
      const valueB = b[sortConfig.key] || '';
      
      return sortConfig.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }, [users, searchTerm, sortConfig]);

  const startEditing = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      golfClubSize: user.golfClubSize || ''
    });
    setIsEditing(true);
  };

  const saveUserChanges = async () => {
    try {
      if (isEditing && selectedUser) {
        await updateUser(selectedUser._id, formData);
        setIsEditing(false);
        setSelectedUser(null);
      } else if (isCreating) {
        await createUser(formData);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setSelectedUser(null);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const renderUserForm = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Profile' : 'New Customer'}
          </h3>
          <button 
            onClick={() => {
              setIsEditing(false);
              setIsCreating(false);
              setSelectedUser(null);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RiCloseLine className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          saveUserChanges();
        }}>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: 'name', label: 'Full Name', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phone', label: 'Phone Number', type: 'tel' },
              { name: 'address', label: 'Address', type: 'text' },
              { name: 'golfClubSize', label: 'Golf Club Size', type: 'text' }
            ].map(field => (
              <div key={field.name}>
                <div className="text-sm text-gray-500 mb-1">{field.label}</div>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  required={field.required}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <RiUserLine className="w-8 h-8 text-blue-500" />
                <h1 className="text-2xl font-semibold text-gray-800">
                  Customers
                </h1>
              </div>
              
              <div className="flex-1 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
                
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      address: '',
                      golfClubSize: ''
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <RiAddLine className="w-5 h-5" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' }
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
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedUsers.map(user => (
                    <tr 
                      key={user._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">{user.phone || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => startEditing(user)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {processedUsers.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No customers found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {(isEditing || isCreating) && renderUserForm()}
    </div>
  );
};

export default CustomerProfiles;