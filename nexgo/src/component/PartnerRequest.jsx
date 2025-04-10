import React, { useState } from "react";
import { User, Mail, MapPin, Image } from "lucide-react"; // Import Lucide icons

const PartnerRequest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    location: "",
    menuImage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      menuImage: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="p-8 bg-[#f8f1e7] text-[#502314]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Partner Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3">
            <User size={20} />
            <div className="w-full">
              <label htmlFor="name" className="block">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail size={20} />
            <div className="w-full">
              <label htmlFor="email" className="block">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User size={20} />
            <div className="w-full">
              <label htmlFor="restaurantName" className="block">Restaurant Name</label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin size={20} />
            <div className="w-full">
              <label htmlFor="location" className="block">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Image size={20} />
            <div className="w-full">
              <label htmlFor="menuImage" className="block">Menu Image</label>
              <input
                type="file"
                id="menuImage"
                name="menuImage"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerRequest;
