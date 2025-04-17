import axios from "axios";


// Base URL for API - change this to your backend URL
export const API_BASE_URL = "http://localhost:5000"; // Adjust to your backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});



// API service functions
export const apiService = {
  // Restaurant functions
  getRestaurants: async () => {
    const response = await api.get("/restaurants");
    return response.data;
  },


  // Add this new method
  getDashboardStats: async () => {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },

  getRestaurantById: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}`);
    return response.data;
  },

  // Menu functions
  getMenuItems: async (restaurantId) => {
    const response = await api.get(`/menu/${restaurantId}`);
    return response.data;
  },

  getRestaurantMenu: async (restaurantId) => {
    const response = await api.get(`/menu/${restaurantId}`);
    return response.data;
  },

  addMenuItem: async (formData) => {
    const response = await api.post("/menu", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  deleteMenuItem: async (menuItemId) => {
    const response = await api.delete(`/menu/${menuItemId}`);
    return response.data;
  },

  // Order functions
  getCustomerOrders: async (customerId) => {
    const response = await api.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  getRestaurantOrders: async (restaurantId) => {
    const response = await api.get(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  getOrdersForDelivery: async () => {
    const response = await api.get("/orders/delivery");
    return response.data;
  },

  getDriverOrders: async (driverId) => {
    const response = await api.get(`/orders/delivery/${driverId}`);
    return response.data;
  },

  createOrder: async (orderData) => {
    try {
      // Validate that restaurantId exists in the orderData
      if (!orderData.restaurantId) {
        throw new Error("Restaurant ID is missing from order data");
      }
      
      const response = await api.post("/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  updateOrderStatus: async (
    orderId,
    status,
    additionalData = {}
  ) => {
    const response = await api.patch(`/orders/${orderId}/status`, {
      status,
      ...additionalData,
    });
    return response.data;
  },

  cancelOrder: async (orderId, customerId) => {
    const response = await api.patch(`/orders/${orderId}/cancel`, {
      customerId,
    });
    return response.data;
  },
};