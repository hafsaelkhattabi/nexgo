import React, { useState, useContext } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { LanguageContext } from "../../context/LanguageContext";
import { ThemeContext } from "../../context/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardOverview from "../DashboardOverview";

function AdminDashboard() {
  const { language, translations } = useContext(LanguageContext);
  const { darkMode } = useContext(ThemeContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Calculate sidebar width for the header component
  const sidebarWidth = isCollapsed ? 70 : 250;

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Sidebar */}
      <Sidebar
        className=""
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
        
        {/* Main content with appropriate padding from the top for the fixed header */}
        <div className="flex-1 p-6 mt-16">
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
