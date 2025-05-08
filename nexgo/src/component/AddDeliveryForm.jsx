import axios from 'axios';
import React, { useState, useContext } from "react";
import { Car, Bike, Navigation, Phone, Mail, User, MapPin, Key, Calendar } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // Update path if needed

const AddDeliveryForm = () => {
  const { darkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    vehicleType: "car"
  });

  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (formStep === 1 && validateStep1()) {
      setFormStep(2);
    }
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateStep2()) {
      return;
    }

    if (!formData.password) {
      alert("Password is required!");
      return;
    }
  
  
    try {
      // Replace fetch with axios
      console.log("Submitting form data:", formData);
      const response = await axios.post("http://localhost:5000/delivery/register", formData, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      // Axios automatically parses the response as JSON
      const data = response.data;
  
      if (response.status === 201) {
        alert("Registration successful!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
          dateOfBirth: "",
          vehicleType: "car"
        });
        setFormStep(1);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error during registration. Please check all fields and try again.");
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
      darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-gray-200"
    }`}>
      <div className="flex items-center justify-center mb-4">
        <Car className="text-yellow-500 mr-2" size={28} />
        <h2 className={`text-2xl font-bold text-center transition-colors duration-300 ${
          darkMode ? "text-gray-100" : "text-[#502314]"
        }`}>Delivery Driver Registration</h2>
      </div>
      
      {/* Progress indicator */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
            formStep === 1 
              ? darkMode ? "bg-yellow-600 text-white" : "bg-[#FFC72C] text-[#502314]"
              : darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700"
          }`}>
            1
          </div>
          <div className={`h-1 w-10 ${
            darkMode ? "bg-gray-600" : "bg-gray-200"
          }`}></div>
          <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
            formStep === 2 
              ? darkMode ? "bg-yellow-600 text-white" : "bg-[#FFC72C] text-[#502314]"
              : darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700"
          }`}>
            2
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formStep === 1 ? (
          <>
            {/* Step 1: Personal Information */}
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <User size={16} className="mr-1" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Mail size={16} className="mr-1" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Phone size={16} className="mr-1" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <MapPin size={16} className="mr-1" /> Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={nextStep}
                className={`py-2 px-6 rounded-full font-medium flex items-center transition-colors duration-300 ${
                  darkMode
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-[#FFC72C] text-[#502314] hover:bg-[#502314] hover:text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 2: Account Details */}
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Key size={16} className="mr-1" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Key size={16} className="mr-1" /> Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Calendar size={16} className="mr-1" /> Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100" 
                    : "bg-white border-gray-300"
                }`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Navigation size={16} className="mr-1" /> Vehicle Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.vehicleType === "car" 
                    ? darkMode 
                      ? "bg-yellow-900 border-yellow-700 text-yellow-100" 
                      : "bg-yellow-100 border-yellow-400"
                    : darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-300" 
                      : "bg-white"
                }`}>
                  <Car size={24} className={
                    formData.vehicleType === "car" 
                      ? darkMode ? "text-yellow-400" : "text-[#502314]" 
                      : darkMode ? "text-gray-400" : "text-gray-500"
                  } />
                  <input 
                    type="radio" 
                    name="vehicleType" 
                    value="car" 
                    checked={formData.vehicleType === "car"}
                    onChange={handleChange} 
                    className="sr-only" 
                  />
                  <span className="mt-1 text-sm">Car</span>
                </label>
                
                <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.vehicleType === "motorcycle" 
                    ? darkMode 
                      ? "bg-yellow-900 border-yellow-700 text-yellow-100" 
                      : "bg-yellow-100 border-yellow-400"
                    : darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-300" 
                      : "bg-white"
                }`}>
                  <Bike size={24} className={
                    formData.vehicleType === "motorcycle" 
                      ? darkMode ? "text-yellow-400" : "text-[#502314]" 
                      : darkMode ? "text-gray-400" : "text-gray-500"
                  } />
                  <input 
                    type="radio" 
                    name="vehicleType" 
                    value="motorcycle" 
                    checked={formData.vehicleType === "motorcycle"}
                    onChange={handleChange} 
                    className="sr-only" 
                  />
                  <span className="mt-1 text-sm">Motorcycle</span>
                </label>
                
                <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.vehicleType === "bicycle" 
                    ? darkMode 
                      ? "bg-yellow-900 border-yellow-700 text-yellow-100" 
                      : "bg-yellow-100 border-yellow-400"
                    : darkMode 
                      ? "bg-gray-700 border-gray-600 text-gray-300" 
                      : "bg-white"
                }`}>
                  <Bike size={24} className={
                    formData.vehicleType === "bicycle" 
                      ? darkMode ? "text-yellow-400" : "text-[#502314]" 
                      : darkMode ? "text-gray-400" : "text-gray-500"
                  } />
                  <input 
                    type="radio" 
                    name="vehicleType" 
                    value="bicycle" 
                    checked={formData.vehicleType === "bicycle"}
                    onChange={handleChange} 
                    className="sr-only" 
                  />
                  <span className="mt-1 text-sm">Bicycle</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={prevStep}
                className={`py-2 px-6 rounded-full font-medium transition-colors duration-300 ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Back
              </button>
              
              <button
                type="submit"
                className={`py-2 px-6 rounded-full font-bold flex items-center transition-colors duration-300 ${
                  darkMode
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-[#FFC72C] text-[#502314] hover:bg-[#502314] hover:text-white"
                }`}
              >
                <User size={18} className="mr-2" />
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AddDeliveryForm;