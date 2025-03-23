import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

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
        <h2 className="text-3xl font-bold text-center mb-8">
          {translations[language]["opportunitiesTitle"]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1: Delivery with Us */}
          <div
            className={`p-6 rounded-lg shadow-lg text-center ${
              darkMode ? "bg-gray-800 text-white" : "bg-[#f8f1e7] text-[#502314]"
            }`}
          >
            <img
              src="/delivery.jpg"
              alt="Delivery"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-4">
              {translations[language]["jobTitle"]}
            </h3>
            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {translations[language]["jobDescription"]}
            </p>
            <a
              href="/subscribe/delivery"
              className={`bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300`}
            >
              {translations[language]["applyButton"]}
            </a>
          </div>

          {/* Card 2: Devenir Partenaire */}
          <div
            className={`p-6 rounded-lg shadow-lg text-center ${
              darkMode ? "bg-gray-800 text-white" : "bg-[#f8f1e7] text-[#502314]"
            }`}
          >
            <img
              src="/partenaire.jpg"
              alt="Partenaire"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-4">
              {translations[language]["partnerTitle"]}
            </h3>
            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {translations[language]["partnerDescription"]}
            </p>
            <a
              href="/subscribe/partenaire"
              className={`bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300`}
            >
              {translations[language]["registerButton"]}
            </a>
          </div>

          {/* Card 3: Les plats de vos restaurants préférés */}
          <div
            className={`p-6 rounded-lg shadow-lg text-center ${
              darkMode ? "bg-gray-800 text-white" : "bg-[#f8f1e7] text-[#502314]"
            }`}
          >
            <img
              src="/plats.jpg"
              alt="Livraison"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-bold mb-4">
              {translations[language]["deliveryTitle"]}
            </h3>
            <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {translations[language]["deliveryDescription"]}
            </p>
            <Link
              to="/order" // Link to the OrderPage component
              className={`bg-[#FFC72C] text-[#502314] py-2 px-6 rounded-full font-bold hover:bg-[#502314] hover:text-white transition duration-300`}
            >
              {translations[language]["orderButton"]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;