import React, { useState } from "react";
import { Car, Bike, Navigation, Phone, Mail, User, MapPin } from "lucide-react";

const AddDeliveryForm = () => {
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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-2">
        <Car className="text-yellow-500 mr-2" size={28} />
        <h2 className="text-2xl font-bold  text-center text-[#502314]">Add Delivery</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 text-[#502314] flex items-center">
            <User size={16} className="mr-1" /> Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 text-[#502314] flex items-center">
            <Mail size={16} className="mr-1" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 text-[#502314] flex items-center">
            <Phone size={16} className="mr-1" /> Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 text-[#502314] flex items-center">
            <MapPin size={16} className="mr-1" /> Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 text-[#502314] flex items-center">
            <Navigation size={16} className="mr-1" /> Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.vehicleType === "car" ? "bg-yellow-100 border-yellow-400" : "bg-white"}`}>
              <Car size={24} className={formData.vehicleType === "car" ? "text-[#502314]" : "text-gray-500"} />
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
            
            <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.vehicleType === "motorcycle" ? "bg-yellow-100 border-yellow-400" : "bg-white"}`}>
              <Bike size={24} className={formData.vehicleType === "motorcycle" ? "text-[#502314]" : "text-gray-500"} />
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
            
            <label className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${formData.vehicleType === "bicycle" ? "bg-yellow-100 border-yellow-400" : "bg-white"}`}>
              <Bike size={24} className={formData.vehicleType === "bicycle" ? "text-[#502314]" : "text-gray-500"} />
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
            className="bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white flex items-center transition-colors duration-300"
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