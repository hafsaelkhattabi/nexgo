import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Opportunities = () => {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className={`p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8f1e7] text-[#502314]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 relative">
          <span className="inline-block relative z-10">{translations[language]["opportunitiesTitle"]}</span>
          <span className="absolute h-3 w-24 bg-amber-300 left-1/2 bottom-0 transform -translate-x-1/2 -z-0 rounded-full opacity-60"></span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1: Delivery with Us */}
          <div
            className={`rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-[#502314]"
            }`}
          >
            <div className="relative">
              <img
                src="/delivery.jpg"
                alt="Delivery"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {translations[language]["jobTitle"]}
              </h3>
              <p className={`mb-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language]["jobDescription"]}
              </p>
              <Link
                to="/subscribe/delivery"
                className={`inline-block bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300 shadow-md`}
              >
                {translations[language]["applyButton"]}
              </Link>
            </div>
          </div>

          {/* Card 2: Devenir Partenaire */}
          <div
            className={`rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-[#502314]"
            }`}
          >
            <div className="relative">
              <img
                src="/partenaire.jpg"
                alt="Partenaire"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {translations[language]["partnerTitle"]}
              </h3>
              <p className={`mb-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language]["partnerDescription"]}
              </p>
              <Link
                to="/subscribe/partenaire"
                className={`inline-block bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300 shadow-md`}
              >
                {translations[language]["registerButton"]}
              </Link>
            </div>
          </div>

          {/* New Card 3: Login to Access Features */}
          <div
            className={`rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-[#502314]"
            }`}
          >
            <div className="relative">
              <img
                src="/public/login.jpg" 
                alt="Login"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {translations[language]["loginTitle"] || "Join Our Community"}
              </h3>
              <p className={`mb-5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {translations[language]["loginDescription"] || "Login or register to access all features including ordering from your favorite restaurants"}
              </p>
              <Link
                to="/login"
                className={`inline-block bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300 shadow-md`}
              >
                {translations[language]["loginButton"] || "Login/Register"}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Join our growing community of partners and drivers today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;