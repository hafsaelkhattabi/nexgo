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

  // ========================
  // Authentication Methods
  // ========================
  async login(credentials) {
    console.log("Login attempt with:", credentials);

    // Check for hardcoded admin login
    const isHardcodedAdmin =
      (credentials.email === this.adminCredentials.email &&
        credentials.password === this.adminCredentials.password) ||
      (credentials.email === "admin" &&
        credentials.password === this.adminCredentials.password);

    if (isHardcodedAdmin) {
      console.log("Logging in as hardcoded admin...");
      const adminUser = {
        id: "admin-id",
        name: "Administrator",
        email: this.adminCredentials.email,
        role: "admin"
      };

      localStorage.setItem(this.tokenKey, "admin-token-hardcoded");
      localStorage.setItem(this.userKey, JSON.stringify(adminUser));
      return adminUser;
    }

    // Regular user login
    try {
      console.log("Falling back to backend login...");
      console.log("Login attempt with:", credentials);
      const response = await this.api.post('/restaurants/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.token) {
        localStorage.setItem(this.tokenKey, response.data.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.data));
      }

      return this.getUserData();
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
