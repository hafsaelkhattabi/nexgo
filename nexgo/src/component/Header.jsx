import React, { useState, useEffect, useRef, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext"; // Language Context
import { ThemeContext } from "../context/ThemeContext"; // Theme Context
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa"; // Icons
import { Link } from "react-router-dom"; // For navigation

function Header() {
  const { language, setLanguage, translations } = useContext(LanguageContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state (responsive)
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const servicesRef = useRef(null);
  const aboutRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setIsAboutOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`w-full shadow-md fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8f1e7] text-[#502314]"
      }`}
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/nexgo (2).png" className="w-[88px] h-auto" alt="NexGo" />
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/"
            className="uppercase font-bold transition-colors duration-300 hover:text-[#FFC72C] relative after:content-[''] after:block after:h-1 after:w-full after:bg-[#FFC72C] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            {translations[language]["home"]}
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="uppercase font-bold transition-colors duration-300 hover:text-[#FFC72C] relative after:content-[''] after:block after:h-1 after:w-full after:bg-[#FFC72C] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {translations[language]["services"]}
            </button>
            {isServicesOpen && (
              <div
                className={`absolute mt-2 w-48 rounded-lg shadow-lg ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-[#502314]"
                }`}
              >
                <Link
                  to="/NexGo-Food"
                  className={`block px-4 py-2 ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-[#FFC72C] hover:text-[#502314]"
                  }`}
                >
                  NexGo Food
                </Link>
                <Link
                  to="/Order-for-someone-else"
                  className={`block px-4 py-2 ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-[#FFC72C] hover:text-[#502314]"
                  }`}
                >
                  Order for someone else
                </Link>
              </div>
            )}
          </div>

          {/* Restaurants Link */}
          <Link
            to="/restaurants"
            className="uppercase font-bold transition-colors duration-300 hover:text-[#FFC72C] relative after:content-[''] after:block after:h-1 after:w-full after:bg-[#FFC72C] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            {translations[language]["restaurants"] || "Restaurants"}
          </Link>

          {/* About Us Dropdown */}
          <div className="relative" ref={aboutRef}>
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="uppercase font-bold transition-colors duration-300 hover:text-[#FFC72C] relative after:content-[''] after:block after:h-1 after:w-full after:bg-[#FFC72C] after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {translations[language]["about"]}
            </button>
            {isAboutOpen && (
              <div
                className={`absolute mt-2 w-48 rounded-lg shadow-lg ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-[#502314]"
                }`}
              >
                <Link
                  to="/our-mission"
                  className={`block px-4 py-2 ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-[#FFC72C] hover:text-[#502314]"
                  }`}
                >
                  Our Mission
                </Link>
                <Link
                  to="/careers"
                  className={`block px-4 py-2 ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-[#FFC72C] hover:text-[#502314]"
                  }`}
                >
                  Careers
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById("footer").offsetTop, behavior: "smooth" })}
                  className={`block w-full text-left px-4 py-2 ${
                    darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-[#FFC72C] hover:text-[#502314]"
                  }`}
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dark Mode & Language Toggle + Login Button */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switch */}
          <select
            className={`bg-transparent border p-2 rounded ${
              darkMode ? "text-white" : "text-[#502314]"
            }`}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
          </select>

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="text-2xl">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          {/* Let's Go (Login) Button */}
          <Link
            to="/auth"
            className="bg-[#FFC72C] text-[#502314] py-2 px-5 rounded-full text-base font-bold no-underline transition-colors duration-300 hover:bg-[#502314] hover:text-white shadow-md"
          >
            Let's Go!
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden p-4 ${
            darkMode ? "bg-gray-800 text-white" : "bg-[#f8f1e7] text-[#502314]"
          }`}
        >
          <Link
            to="/"
            className="block py-2 font-bold hover:text-[#FFC72C]"
          >
            {translations[language]["home"]}
          </Link>

          {/* Services Dropdown in Mobile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="w-full text-left py-2 font-bold hover:text-[#FFC72C]"
            >
              {translations[language]["services"]}
            </button>
            {isServicesOpen && (
              <div className="pl-4">
                <Link
                  to="/NexGo-Food"
                  className="block py-2 hover:text-[#FFC72C]"
                >
                  NexGo Food
                </Link>
                <Link
                  to="/Order-for-someone-else"
                  className="block py-2 hover:text-[#FFC72C]"
                >
                  Order for someone else
                </Link>
              </div>
            )}
          </div>

          {/* Restaurants Link in Mobile Menu */}
          <Link
            to="/restaurants"
            className="block py-2 font-bold hover:text-[#FFC72C]"
          >
            {translations[language]["restaurants"] || "Restaurants"}
          </Link>

          {/* About Us Dropdown in Mobile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              className="w-full text-left py-2 font-bold hover:text-[#FFC72C]"
            >
              {translations[language]["about"]}
            </button>
            {isAboutOpen && (
              <div className="pl-4">
                <Link
                  to="/our-mission"
                  className="block py-2 hover:text-[#FFC72C]"
                >
                  Our Mission
                </Link>
                <Link
                  to="/careers"
                  className="block py-2 hover:text-[#FFC72C]"
                >
                  Careers
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: document.getElementById("footer").offsetTop, behavior: "smooth" });
                  }}
                  className="block w-full text-left py-2 hover:text-[#FFC72C]"
                >
                  Contact Us
                </button>
              </div>
            )}
          </div>

          {/* Language Switch in Mobile Menu */}
          <div className="mt-4">
            <select
              className={`bg-transparent border p-2 rounded w-full ${
                darkMode ? "text-white" : "text-[#502314]"
              }`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
          </div>

          {/* Dark Mode Toggle and Login Button in Mobile Menu */}
          <div className="mt-4 flex justify-between items-center">
            <button onClick={toggleDarkMode} className="text-2xl">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <Link
              to="/auth"
              className="bg-[#FFC72C] text-[#502314] py-2 px-5 rounded-full text-base font-bold no-underline transition-colors duration-300 hover:bg-[#502314] hover:text-white shadow-md"
            >
              Let's Go!
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
