import React, { useState, useContext, useEffect } from 'react';
import { 
  RiUserLine, 
  RiEditLine, 
  RiSearchLine, 
  RiAddLine,
  RiDeleteBinLine,
  RiCloseLine
} from 'react-icons/ri';
import UserContext from '../../context/UserContext';

const CustomerProfiles = () => {
  const { users, fetchUsers, updateUser, deleteUser, createUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'golfClubSize', label: 'Golf Club Size', type: 'text' }
  ];

  const renderUserForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 transform transition-all">
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
          <div className="space-y-4">
            {formFields.map(field => (
              <div key={field.name}>
                <label 
                  htmlFor={field.name} 
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <RiUserLine className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-semibold text-gray-800">
                Customers
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RiAddLine />
                <span>Add Customer</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Phone</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
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
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <RiEditLine className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <RiDeleteBinLine className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No customers found</p>
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