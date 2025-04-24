import axios from "axios";
import React, { useState, useContext } from "react";
import { Store, MapPin, Utensils, Phone, Image, User } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // Update path if needed

function AddRestaurantForm() {
  const { darkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    contact: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("cuisine", formData.cuisine);
    data.append("contact", formData.contact);
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:5000/image/restaurants", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Restaurant added successfully!");
        setFormData({ name: "", address: "", cuisine: "", contact: "", image: null });
      } else {
        alert("Failed to add restaurant.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the restaurant.");
    }
  };

  return (
    <div className={`min-h-screen w-full p-4 transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className={`w-full rounded-lg shadow-md p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white"
      }`}>
        <div className="flex items-center justify-center mb-2">
          <Store className="text-yellow-500 mr-2" size={28} />
          <h2 className={`text-2xl font-bold text-center transition-colors duration-300 ${
            darkMode ? "text-gray-100" : "text-[#502314]"
          }`}>Add Restaurant</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
              darkMode ? "text-gray-300" : "text-[#502314]"
            }`}>
              <User size={16} className="mr-1" /> Restaurant Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter restaurant name"
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
              <Utensils size={16} className="mr-1" /> Cuisine Type
            </label>
            <input
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="Enter cuisine type"
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
              <Phone size={16} className="mr-1" /> Contact Information
            </label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact information"
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
              <Image size={16} className="mr-1" /> Restaurant Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-100 file:bg-gray-600 file:text-gray-100 file:border-gray-500" 
                  : "bg-white border-gray-300"
              }`}
              accept="image/*"
              required
            />
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
              <Store size={18} className="mr-2" />
              Add Restaurant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRestaurantForm;