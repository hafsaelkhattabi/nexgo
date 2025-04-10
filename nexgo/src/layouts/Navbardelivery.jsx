import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';

// Utility function for class concatenation
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'glassmorphism shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="w-6 h-6 text-primary" />
          <span className="text-xl font-medium">DeliverDash</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <NavItem to="/" label="Dashboard" />
          <NavItem to="/tracking" label="Tracking" />
        </div>
        <div className="flex items-center">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// NavItem component
const NavItem = ({ to, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      'relative py-2 text-sm font-medium transition-all duration-200 ease-in-out',
      isActive ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
    )}
  >
    {({ isActive }) => (
      <>
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
        )}
      </>
    )}
  </NavLink>
);

export default Navbar;