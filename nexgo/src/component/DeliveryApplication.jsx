import React, { useState, useContext } from "react";
import axios from "axios";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { User, Mail, Phone, FileText } from "lucide-react"; // Importing Lucide Icons

const DeliveryApplication = () => {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null, // File Upload
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("resume", formData.resume);

    try {
      const response = await axios.post("http://localhost:5000/apply", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while submitting your application.");
    }
  };

  return (
    <div className={`p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-[#502314]"}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-[#502314]"}`}>
        {translations[language].deliveryApplicationTitle}
      </h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3">
            <User size={20} />
            <div className="w-full">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language].name}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={translations[language].namePlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail size={20} />
            <div className="w-full">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language].email}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={translations[language].emailPlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone size={20} />
            <div className="w-full">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language].phoneNumber}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={translations[language].phonePlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText size={20} />
            <div className="w-full">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language].resume}
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300"
          >
            {translations[language].submitApplication}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryApplication;
