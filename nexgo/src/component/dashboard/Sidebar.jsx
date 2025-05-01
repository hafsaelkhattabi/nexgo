import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import authService from '../../services/AuthService';
import {
  Store,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Truck,
  LogOut,
  UserPlus
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, isCollapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 group',
        isActive
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'text-muted-foreground hover:bg-secondary/50',
        isCollapsed ? 'justify-center' : 'justify-start'
      )}
    >
      <Icon className="w-5 h-5" />
      {!isCollapsed && (
        <span className={cn('transition-all duration-300', isCollapsed ? 'opacity-0 w-0' : 'opacity-100')}>
          {label}
        </span>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md pointer-events-none">
          {label}
        </div>
      )}
    </Link>
  );
};

const Sidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    authService.logout(); // Clear token from localStorage
    navigate('/login');   // Go directly to login route
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-background/80 backdrop-blur-lg fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out border-r border-border/50',
        isCollapsed ? 'w-[70px]' : 'w-[250px]',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">D</span>
            </div>
            <span className="font-medium text-lg">Dashboard</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">D</span>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary/50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {/* Add the new Register User item */}
          <SidebarItem 
            icon={UserPlus} 
            label="Register User" 
            path="/admin/register-user" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Store} 
            label="Add Restaurant" 
            path="/admin/add-restaurant" 
            isCollapsed={isCollapsed} 
          />
          <SidebarItem 
            icon={Truck} 
            label="Add Delivery" 
            path="/admin/add-delivery" 
            isCollapsed={isCollapsed} 
          />
        </div>
      </div>

      {/* Sidebar Footer with Logout Button */}
      <div className="py-4 px-3 border-t border-border/50">
        <SidebarItem
          icon={LogOut}
          label="Sign Out"
          path="/"
          isCollapsed={isCollapsed}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;