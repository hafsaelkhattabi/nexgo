import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext"; // Language Context
import { ThemeContext } from "../context/ThemeContext"; // Theme Context

const Content = () => {
  const { language, translations } = useContext(LanguageContext); // Access language and translations
  const { darkMode } = useContext(ThemeContext); // Access dark mode state

  // List of categories
  const categories = [
    "Burgers",
    "Sandwichs",
    "Pizza",
    "Poulet",
    "Tacos",
    "Grillades",
    "Américain",
    "Asiatique",
    "Pâtes",
    "Sushi",
  ];

  return (
    <div
      className={`p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8f1e7] text-[#502314]"
      }`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        {/* Add an image here */}
        <img
          src="public/cities.svg" 
          alt="Categories"
          className="w-24 h-24 mx-auto mb-4 mt-4" 
        />
        <h2 className="text-3xl font-bold">
          {translations[language]["bestCategories"]}
          Best Categories 
        </h2>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg text-center transition duration-300 cursor-pointer ${
              darkMode
                ? "bg-gray-800 hover:bg-[#FFC72C] hover:text-[#502314]"
                : "bg-white hover:bg-[#FFC72C]"
            }`}
          >
            <span className="font-semibold">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;