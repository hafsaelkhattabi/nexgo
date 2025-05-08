// import axios from 'axios';

// class AuthService {
//   constructor() {
//     // Admin credentials hardcoded - not ideal for production but meets requirements
//     this.adminCredentials = {
//       email: "admin@example.com",
//       password: "admin123",
//     };
    
//     this.tokenKey = "auth_token";
//     this.userKey = "user_data";
//   }

//   async login(credentials) {
//     // Special check for admin login
//     if (
//       (credentials.login === this.adminCredentials.email && 
//       credentials.password === this.adminCredentials.password) ||
//       // If you want to also allow admin username login
//       (credentials.login === "admin" && 
//       credentials.password === this.adminCredentials.password)
//     ) {
//       // Create admin user data
//       const adminUser = {
//         id: "admin-id",
//         name: "Administrator",
//         email: this.adminCredentials.email,
//         role: "admin"
//       };
      
//       // Store admin session
//       localStorage.setItem(this.tokenKey, "admin-token-hardcoded");
//       localStorage.setItem(this.userKey, JSON.stringify(adminUser));
      
//       return adminUser;
//     }
    
//     // Regular login for other users goes to API
//     const response = await axios.post('/api/auth/login', credentials);
    
//     if (response.data.token) {
//       localStorage.setItem(this.tokenKey, response.data.token);
//       localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
//     }
    
//     return response.data.user;
//   }

//   logout() {
//     localStorage.removeItem(this.tokenKey);
//     localStorage.removeItem(this.userKey);
//   }

//   isAuthenticated() {
//     return !!localStorage.getItem(this.tokenKey);
//   }

//   getAuthToken() {
//     return localStorage.getItem(this.tokenKey);
//   }

//   getUserData() {
//     const userData = localStorage.getItem(this.userKey);
//     return userData ? JSON.parse(userData) : null;
//   }

//   getUserRole() {
//     const userData = this.getUserData();
//     return userData ? userData.role : null;
//   }
// }

// const authService = new AuthService();
// export default authService;

import axios from 'axios';
import { API_BASE_URL } from './ApiServices';

class AuthService {
  constructor() {
    this.adminCredentials = {
      email: "admin@example.com",
      password: "admin123",
    };
    
    this.api = axios.create({
      baseURL: 'http://localhost:5000',
    });
    
    this.tokenKey = "auth_token";
    this.userKey = "user_data";
  }


  async registerCustomer(customerData) {
    const data = {
      ...customerData,
      role: 'customer'
    };
    return this.register(data);
  }


  // ========================
  // Authentication Methods
  // ========================
  async login(credentials) {
    console.log("Login attempt with:", credentials);
  
    // Admin login
    if (
      credentials.email === this.adminCredentials.email &&
      credentials.password === this.adminCredentials.password
    ) {
      const adminUser = {
        id: "admin-id",
        name: "Administrator",
        email: this.adminCredentials.email,
        role: "admin",
      };
  
      localStorage.setItem(this.tokenKey, "admin-token-hardcoded");
      localStorage.setItem(this.userKey, JSON.stringify(adminUser));
      return adminUser;
    }
  
    // Determine user type by email pattern or context
    let loginEndpoint = "/restaurants/login";
    let role = "restaurant";
  
    if (credentials.email.includes("delivery")) {
      loginEndpoint = "/delivery/login";
      role = "delivery";
    }
  
    try {
      const response = await this.api.post(loginEndpoint, {
        email: credentials.email,
        password: credentials.password,
      });
  
      console.log("Login response from backend:", response.data);
  
      if (!response.data.token) {
        throw new Error("No token received");
      }
  
      // Store token
      localStorage.setItem(this.tokenKey, response.data.token);
  
      // Prepare user data
      const userData = {
        role,
        _id: response.data.userId || 'temp-id',
        email: credentials.email,
        token: response.data.token,
        ...(role === 'restaurant' && { restaurantId: response.data.restaurantId })
      };
  
      localStorage.setItem(this.userKey, JSON.stringify(userData));
  
      // Store restaurantId separately if it's a restaurant
      if (role === 'restaurant' && response.data.restaurantId) {
        localStorage.setItem('restaurantId', response.data.restaurantId);
      }
  
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  

  // ========================
  // Registration Methods
  // ========================
  async register(userData) {
    try {
      const response = await this.api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async registerRestaurant(restaurantData) {
    const data = {
      ...restaurantData,
      role: 'restaurant'
    };
    return this.register(data);
  }

  async registerDelivery(deliveryData) {
    const data = {
      ...deliveryData,
      role: 'delivery'
    };
    return this.register(data);
  }

  // ========================
  // Session Management
  // ========================
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('restaurantId');
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

  // ========================
  // Role Helpers
  // ========================
  getUserRole() {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  isRestaurant() {
    return this.getUserRole() === 'restaurant';
  }

  isDelivery() {
    return this.getUserRole() === 'delivery';
  }

  // ========================
  // Data Retrieval
  // ========================
  async getRestaurantData(userId) {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
      // Fetch restaurant data based on user ID
      const response = await axios.get(`${API_BASE_URL}/api/restaurants/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data._id) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      return null;
    }
  }
  
  // Method to get the restaurant ID from local storage
  getRestaurantId() {
    return localStorage.getItem('restaurantId');
  }
  
  // Method to set restaurant ID in local storage
  setRestaurantId(id) {
    localStorage.setItem('restaurantId', id);
  }
  
  // Method to clear restaurant ID from local storage
  clearRestaurantId() {
    localStorage.removeItem('restaurantId');
  }

  // ========================
  // Utilities
  // ========================
  getHomePath() {
    switch (this.getUserRole()) {
      case 'admin': return '/admin';
      case 'restaurant': return '/restaurant';
      case 'delivery': return '/delivery';
      default: return '/login';
    }
  }
}

const authService = new AuthService();
export default authService;