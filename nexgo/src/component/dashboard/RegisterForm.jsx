import React, { useState } from 'react';
import { User, Mail, Lock, Building, UserCog } from 'lucide-react';
import authService from '../../services/AuthService';

const RegisterUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    role: 'restaurant'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      role: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      let result;
      
      // Use the specific registration methods based on role
      if (formData.role === 'restaurant') {
        result = await authService.registerRestaurant(formData);
      } else if (formData.role === 'delivery') {
        result = await authService.registerDelivery(formData);
      } else {
        // Fallback to generic register for other roles (like admin)
        result = await authService.register(formData);
      }
      
      console.log('Registration successful:', result);
      setSuccessMessage(`${formData.role} user registered successfully!`);
      
      // Clear form data
      setFormData({
        username: '',
        email: '',
        password: '',
        name: '',
        role: 'restaurant'
      });
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Only admin should be able to access this form
  if (!authService.isAdmin()) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p>You must be an administrator to register new users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Register New User</h2>
        <p className="text-gray-600">Create accounts for restaurant owners or delivery personnel</p>
      </div>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail size={18} className="text-gray-500" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className="text-gray-500" />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Building size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Full Name / Restaurant Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <UserCog size={18} className="text-gray-500" />
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleRoleChange}
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="restaurant">Restaurant</option>
            <option value="delivery">Delivery Personnel</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
          ) : (
            'Register User'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterUserForm;