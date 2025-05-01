import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/AuthService";

const ProtectedRoute = ({ children, allowedRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRole && userRole !== allowedRole) {
    // Redirect based on role
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "restaurant") {
      return <Navigate to="/restaurant" replace />;
    } else if (userRole === "delivery") {
      return <Navigate to="/delivery" replace />;
    } else if (userRole === "customer") {
      return <Navigate to="/customer" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;