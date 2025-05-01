
import axios from 'axios';

class AuthService {
  constructor() {
    // Admin credentials hardcoded - not ideal for production but meets requirements
    this.adminCredentials = {
      email: "admin@example.com",
      password: "admin123",
    };
    
    this.tokenKey = "auth_token";
    this.userKey = "user_data";
  }

  async login(credentials) {
    // Special check for admin login
    if (
      (credentials.login === this.adminCredentials.email && 
      credentials.password === this.adminCredentials.password) ||
      // If you want to also allow admin username login
      (credentials.login === "admin" && 
      credentials.password === this.adminCredentials.password)
    ) {
      // Create admin user data
      const adminUser = {
        id: "admin-id",
        name: "Administrator",
        email: this.adminCredentials.email,
        role: "admin"
      };
      
      // Store admin session
      localStorage.setItem(this.tokenKey, "admin-token-hardcoded");
      localStorage.setItem(this.userKey, JSON.stringify(adminUser));
      
      return adminUser;
    }
    
    // Regular login for other users goes to API
    const response = await axios.post('/api/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem(this.tokenKey, response.data.token);
      localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
    }
    
    return response.data.user;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.tokenKey);
  }

  getAuthToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUserData() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole() {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }
}

const authService = new AuthService();
export default authService;