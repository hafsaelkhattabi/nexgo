import { Navigate } from 'react-router-dom';
import authService from '../services/AuthService';

const AuthGuard = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    switch(userRole) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'restaurant':
        return <Navigate to="/restaurant" />;
      case 'delivery':
        return <Navigate to="/delivery" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;