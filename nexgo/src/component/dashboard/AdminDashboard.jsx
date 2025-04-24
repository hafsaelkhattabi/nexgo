import React, { useState, useContext } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import { ThemeContext } from "../../context/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardOverview from "../DashboardOverview";

function AdminDashboard() {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate sidebar width for the header component
  const sidebarWidth = isCollapsed ? 70 : 250;

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gray-900 text-gray-100" 
        : "bg-gray-50 text-gray-900"
    }`}>
      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        translations={translations}
        language={language}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Main content area with Header and Outlet */}
      <div 
        className="flex flex-col flex-1 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <Header sidebarWidth={sidebarWidth} className="" />
        
        {/* Theme Toggle Button - Fixed Position */}
        <button
          onClick={toggleDarkMode}
          className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
            darkMode 
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300" 
              : "bg-gray-800 text-yellow-300 hover:bg-gray-700"
          }`}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            // Sun icon for dark mode (to switch to light)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            // Moon icon for light mode (to switch to dark)
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        
        {/* Main content with appropriate padding from the top for the fixed header */}
        <div className={`flex-1 p-6 mt-16 ${
          darkMode 
            ? "bg-gray-800 text-gray-100" 
            : "bg-white text-gray-800"
        }`}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="/*" element={<Outlet />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;