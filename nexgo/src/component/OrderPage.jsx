import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext"; // Import LanguageContext
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext
import { User, MapPin, Phone, Edit } from "lucide-react"; // Importing Lucide Icons

const OrderPage = () => {
  const { language, translations } = useContext(LanguageContext); // Access language and translations
  const { darkMode } = useContext(ThemeContext); // Access dark mode state

  return (
    <div
      className={`p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-[#502314]"}`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-[#502314]"}`}
      >
        {translations[language].orderPageTitle}
      </h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-4">
          {/* Name Input */}
          <div className="flex items-center space-x-3">
            <User size={20} />
            <div className="w-full">
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {translations[language].name}
              </label>
              <input
                type="text"
                placeholder={translations[language].namePlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          {/* Address Input */}
          <div className="flex items-center space-x-3">
            <MapPin size={20} />
            <div className="w-full">
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {translations[language].address}
              </label>
              <input
                type="text"
                placeholder={translations[language].addressPlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="flex items-center space-x-3">
            <Phone size={20} />
            <div className="w-full">
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {translations[language].phoneNumber}
              </label>
              <input
                type="tel"
                placeholder={translations[language].phonePlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
              />
            </div>
          </div>

          {/* Order Details Textarea */}
          <div className="flex items-center space-x-3">
            <Edit size={20} />
            <div className="w-full">
              <label
                className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {translations[language].orderDetails}
              </label>
              <textarea
                placeholder={translations[language].orderDetailsPlaceholder}
                className={`w-full p-2 border rounded-lg ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-[#502314] border-gray-300"}`}
                rows="4"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300"
          >
            {translations[language].submitOrder}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;
