import React, { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

const Content = () => {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode } = useContext(ThemeContext);

  // List of categories with icons in English
  const categories = [
    { name: "Burgers", icon: "🍔" },
    { name: "Sandwiches", icon: "🥪" },
    { name: "Pizza", icon: "🍕" },
    { name: "Chicken", icon: "🍗" },
    { name: "Tacos", icon: "🌮" },
    { name: "Grilled Meats", icon: "🥩" },
    { name: "American", icon: "🇺🇸" },
    { name: "Asian", icon: "🥢" },
    { name: "Pasta", icon: "🍝" },
    { name: "Sushi", icon: "🍣" }
  ];

  return (
    <section
      className={`p-8 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8f1e7]  text-amber-900"
      } transition-colors duration-300`}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="/cities.svg"
            alt="Food Categories"
            className="w-24 h-24 mt-4"
          />
        </div>
        <h2 className="text-3xl font-bold">
          {translations?.[language]?.["bestCategories"] || "Best Categories"}
        </h2>
        <p className="mt-2 text-lg opacity-80">
          {translations?.[language]?.["categoriesSubtitle"] || "Find your favorite cuisine"}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg text-center transition duration-300 cursor-pointer transform hover:scale-105 ${
              darkMode
                ? "bg-gray-800 hover:bg-amber-400 hover:text-gray-900"
                : "bg-white shadow-md hover:bg-amber-400"
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <span className="font-semibold">{category.name}</span>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Content;