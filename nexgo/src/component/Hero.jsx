import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import ThemeContext for dark mode
import { LanguageContext } from "../context/LanguageContext"; // Import LanguageContext for language support

const Hero = () => {
  const { darkMode } = useContext(ThemeContext); 
  const { language, translations } = useContext(LanguageContext); 
  const [location, setLocation] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const handleChooseRestaurant = () => {
    alert(`Location: ${location}, Delivery Time: ${deliveryTime}`);
  };

  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('/burger.PNG')`, 
      }}
    >
      <div
        className={`text-center ${
          darkMode ? "text-white" : "text-[#FFC72C]"
        } p-8 rounded-lg mx-4`}
      >
        <h1 className="text-4xl font-bold mb-4 mt-20">
          {translations[language]["heroTitle"]}
        </h1>
        <p className="text-white mb-8 text-2xl">
          {translations[language]["heroSubtitle"]}{" "}
          <span className="rounded text-[#dc582c]">NOW</span> !!!
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={translations[language]["locationPlaceholder"]}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`p-3 border ${
              darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC72C] flex-grow`}
          />
          <input
            type="time"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className={`p-3 border ${
              darkMode ? "border-gray-700 bg-gray-700 text-white" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC72C]`}
          />
          <button
            onClick={handleChooseRestaurant}
            className="bg-[#FFC72C] text-[#502314] p-3 rounded-lg hover:bg-[#502314] hover:text-white transition duration-300 font-semibold"
          >
            {translations[language]["chooseRestaurantButton"]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;