import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext"; // Import LanguageContext
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext

const OrderPage = () => {
  const { language, translations } = useContext(LanguageContext); // Access language and translations
  const { darkMode } = useContext(ThemeContext); // Access dark mode state

  return (
    <div
      className={`p-8 mt-36 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-[#502314]"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-center ${
          darkMode ? "text-white" : "text-[#502314]"
        }`}
      >
        {translations[language].orderPageTitle} {/* Dynamic title */}
      </h1>
      <div className="max-w-2xl mx-auto">
        <form className="space-y-4">
          {/* Order Form Fields */}
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {translations[language].name} {/* Dynamic label */}
            </label>
            <input
              type="text"
              placeholder={translations[language].namePlaceholder} // Dynamic placeholder
              className={`w-full p-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700" // Dark mode styles
                  : "bg-white text-[#502314] border-gray-300" // Light mode styles
              }`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {translations[language].address} {/* Dynamic label */}
            </label>
            <input
              type="text"
              placeholder={translations[language].addressPlaceholder} // Dynamic placeholder
              className={`w-full p-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-[#502314] border-gray-300"
              }`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {translations[language].phoneNumber} {/* Dynamic label */}
            </label>
            <input
              type="tel"
              placeholder={translations[language].phonePlaceholder} // Dynamic placeholder
              className={`w-full p-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-[#502314] border-gray-300"
              }`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {translations[language].orderDetails} {/* Dynamic label */}
            </label>
            <textarea
              placeholder={translations[language].orderDetailsPlaceholder} // Dynamic placeholder
              className={`w-full p-2 border rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-[#502314] border-gray-300"
              }`}
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300"
          >
            {translations[language].submitOrder} {/* Dynamic button text */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderPage;