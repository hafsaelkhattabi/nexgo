// import axios from "axios";
// import React, { useState, useContext } from "react";
// import { Store, MapPin, Utensils, Phone, Image, User } from "lucide-react";
// import { ThemeContext } from "../context/ThemeContext"; 

// function AddRestaurantForm() {
//   const { darkMode } = useContext(ThemeContext);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     address: "",
//     cuisine: "",
//     contact: "",
//     image: null
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     setFormData({ ...formData, [name]: files[0] });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("address", formData.address);
//     data.append("cuisine", formData.cuisine);
//     data.append("contact", formData.contact);
//     if (formData.image) data.append("image", formData.image);

//     try {
//       const response = await axios.post("http://localhost:5000/image/restaurants", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (response.status === 201) {
//         alert("Restaurant added successfully!");
//         setFormData({ name: "", address: "", cuisine: "", contact: "", image: null });
//       } else {
//         alert("Failed to add restaurant.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while adding the restaurant.");
//     }
//   };

//   return (
//     <div className={`min-h-screen w-full p-4 transition-colors duration-300 ${
//       darkMode ? "bg-gray-900" : "bg-gray-50"
//     }`}>
//       <div className={`w-full rounded-lg shadow-md p-6 transition-colors duration-300 ${
//         darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white"
//       }`}>
//         <div className="flex items-center justify-center mb-2">
//           <Store className="text-yellow-500 mr-2" size={28} />
//           <h2 className={`text-2xl font-bold text-center transition-colors duration-300 ${
//             darkMode ? "text-gray-100" : "text-[#502314]"
//           }`}>Add Restaurant</h2>
//         </div>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
//               darkMode ? "text-gray-300" : "text-[#502314]"
//             }`}>
//               <User size={16} className="mr-1" /> Restaurant Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter restaurant name"
//               className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
//                   : "bg-white border-gray-300"
//               }`}
//               required
//             />
//           </div>
          
//           <div>
//             <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
//               darkMode ? "text-gray-300" : "text-[#502314]"
//             }`}>
//               <MapPin size={16} className="mr-1" /> Address
//             </label>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Enter address"
//               className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
//                   : "bg-white border-gray-300"
//               }`}
//               required
//             />
//           </div>
          
//           <div>
//             <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
//               darkMode ? "text-gray-300" : "text-[#502314]"
//             }`}>
//               <Utensils size={16} className="mr-1" /> Cuisine Type
//             </label>
//             <input
//               type="text"
//               name="cuisine"
//               value={formData.cuisine}
//               onChange={handleChange}
//               placeholder="Enter cuisine type"
//               className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
//                   : "bg-white border-gray-300"
//               }`}
//               required
//             />
//           </div>
          
//           <div>
//             <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
//               darkMode ? "text-gray-300" : "text-[#502314]"
//             }`}>
//               <Phone size={16} className="mr-1" /> Contact Information
//             </label>
//             <input
//               type="text"
//               name="contact"
//               value={formData.contact}
//               onChange={handleChange}
//               placeholder="Enter contact information"
//               className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
//                   : "bg-white border-gray-300"
//               }`}
//               required
//             />
//           </div>
          
//           <div>
//             <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
//               darkMode ? "text-gray-300" : "text-[#502314]"
//             }`}>
//               <Image size={16} className="mr-1" /> Restaurant Image
//             </label>
//             <input
//               type="file"
//               name="image"
//               onChange={handleFileChange}
//               className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
//                 darkMode 
//                   ? "bg-gray-700 border-gray-600 text-gray-100 file:bg-gray-600 file:text-gray-100 file:border-gray-500" 
//                   : "bg-white border-gray-300"
//               }`}
//               accept="image/*"
//               required
//             />
//           </div>
          
//           <div className="flex justify-center pt-2">
//             <button
//               type="submit"
//               className={`py-2 px-6 rounded-full font-bold flex items-center transition-colors duration-300 ${
//                 darkMode
//                   ? "bg-yellow-600 text-white hover:bg-yellow-700"
//                   : "bg-[#FFC72C] text-[#502314] hover:bg-[#502314] hover:text-white"
//               }`}
//             >
//               <Store size={18} className="mr-2" />
//               Add Restaurant
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddRestaurantForm;

import axios from "axios";
import React, { useState, useContext } from "react";
import { Store, MapPin, Utensils, Phone, Image, User, Mail, Lock } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; // Update path if needed
import { useNavigate } from "react-router-dom";

function AddRestaurantForm() {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    contact: "",
    image: null,
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create FormData object properly
      const data = new FormData();
      data.append("name", formData.name);
      data.append("address", formData.address);
      data.append("cuisine", formData.cuisine);
      data.append("contact", formData.contact);
      data.append("email", formData.email);
      data.append("password", formData.password);
      
      // Make sure we only append the image if it exists
      if (formData.image) {
        data.append("image", formData.image);
      }
      
      // Debug FormData contents
      console.log("Submitting form data:", {
        name: formData.name,
        address: formData.address,
        cuisine: formData.cuisine,
        contact: formData.contact,
        email: formData.email,
        hasImage: !!formData.image
      });
      
      // Register restaurant with user account
      const response = await axios.post("http://localhost:5000/restaurants", data, {
        headers: { 
          "Content-Type": "multipart/form-data"
        },
      });
  
      if (response.status === 201) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("restaurantId", response.data.restaurantId);
        
        alert("Restaurant registered successfully!");
        
        // Redirect to dashboard
        navigate("/restaurant");
      } else {
        setError("Failed to register restaurant.");
      }
    } catch (error) {
      console.error("Error:", error);
      
      // Better error handling
      if (error.response) {
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        
        // Handle specific error cases
        if (error.response.data && error.response.data.message) {
          if (error.response.data.message === "Email already in use") {
            setError("This email is already registered. Please use a different email address.");
          } else {
            setError(error.response.data.message);
          }
        } else if (error.response.data && error.response.data.error) {
          // Check for common error patterns in the error message
          const errorMsg = error.response.data.error;
          if (errorMsg.includes("duplicate key error")) {
            setError("This email is already registered. Please use a different email address.");
          } else {
            setError("Server error: " + errorMsg);
          }
        } else {
          setError("An error occurred while registering the restaurant.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Request error:", error.request);
        setError("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error message:", error.message);
        setError("An error occurred while processing your request.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full p-4 transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className={`w-full max-w-2xl mx-auto rounded-lg shadow-md p-6 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 shadow-gray-700" : "bg-white"
      }`}>
        <div className="flex items-center justify-center mb-4">
          <Store className="text-yellow-500 mr-2" size={28} />
          <h2 className={`text-2xl font-bold text-center transition-colors duration-300 ${
            darkMode ? "text-gray-100" : "text-[#502314]"
          }`}>Register Your Restaurant</h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b pb-4 mb-4">
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? "text-gray-200" : "text-[#502314]"
            }`}>Restaurant Information</h3>
            
            <div>
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Store size={16} className="mr-1" /> Restaurant Name
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
            
            <div className="mt-3">
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
            
            <div className="mt-3">
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
            
            <div className="mt-3">
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
            
            <div className="mt-3">
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
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
              darkMode ? "text-gray-200" : "text-[#502314]"
            }`}>Account Information</h3>
            
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
                placeholder="Enter email address"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>
            
            <div className="mt-3">
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Lock size={16} className="mr-1" /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>
            
            <div className="mt-3">
              <label className={`text-sm font-medium mb-1 flex items-center transition-colors duration-300 ${
                darkMode ? "text-gray-300" : "text-[#502314]"
              }`}>
                <Lock size={16} className="mr-1" /> Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                  darkMode 
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" 
                    : "bg-white border-gray-300"
                }`}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-2 px-6 rounded-full font-bold flex items-center transition-colors duration-300 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              } ${
                darkMode
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-[#FFC72C] text-[#502314] hover:bg-[#502314] hover:text-white"
              }`}
            >
              <Store size={18} className="mr-2" />
              {isLoading ? "Registering..." : "Register Restaurant"}
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className={`text-sm transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Already have an account?{" "}
              <a 
                href="/login" 
                className={`font-medium transition-colors duration-300 ${
                  darkMode ? "text-yellow-500 hover:text-yellow-400" : "text-[#502314] hover:text-[#FFC72C]"
                }`}
              >
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRestaurantForm;