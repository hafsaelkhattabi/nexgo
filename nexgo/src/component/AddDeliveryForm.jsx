import React, { useState, useContext } from "react";
import { Car, Bike, Navigation, Phone, Mail, User, MapPin } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // Update path if needed

const AddDeliveryForm = () => {
  const { darkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicleType: "car" // Added vehicle type field with default value
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      alert(data.message);
      setFormData({ name: "", email: "", phone: "", address: "", vehicleType: "car" }); // Reset form
    } catch (error) {
      console.error(error);
      alert("Error adding delivery. Please try again.");
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
      darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white shadow-gray-200"
    }`}>
      <div className="flex items-center justify-center mb-2">
        <Car className="text-yellow-500 mr-2" size={28} />
        <h2 className={`text-2xl font-bold text-center transition-colors duration-300 ${
          darkMode ? "text-gray-100" : "text-[#502314]"
        }`}>Add Delivery</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-[#502314]"
          }`}>
            <User size={16} className="mr-1" /> Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                : "bg-white border-gray-300"
            }`}
            required
          />
        </div>
        
        <div>
          <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-[#502314]"
          }`}>
            <Mail size={16} className="mr-1" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                : "bg-white border-gray-300"
            }`}
            required
          />
        </div>
        
        <div>
          <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-[#502314]"
          }`}>
            <Phone size={16} className="mr-1" /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                : "bg-white border-gray-300"
            }`}
            required
          />
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
            placeholder="Enter address"
            className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
              darkMode 
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                : "bg-white border-gray-300"
            }`}
            required
          />
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
        
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className={`py-2 px-6 rounded-full font-bold flex items-center transition-colors duration-300 ${
              darkMode
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-[#FFC72C] text-[#502314] hover:bg-[#502314] hover:text-white"
            }`}
          >
            <Car size={18} className="mr-2" />
            Add Delivery
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDeliveryForm;