import axios from 'axios';
import { toast } from "sonner";

const API_URL = "http://localhost:5000";

class AuthService {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      this.setToken(response.data.token);
      this.setRole(response.data.role);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      this.setToken(response.data.token);
      this.setRole(response.data.role);
      this.setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  getRole() {
    return localStorage.getItem('role');
  }

  setRole(role) {
    localStorage.setItem('role', role);
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getUserRole() {
    return this.getRole();
  }

  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
          toast.error("Your session has expired. Please login again.");
        }
        return Promise.reject(error);
      }
    );
  }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();

export default authService;
