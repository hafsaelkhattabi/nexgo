import React, { useEffect, useState } from "react";
import { ShoppingCart, MapPin, CheckCircle } from "lucide-react";
import { apiService } from "../services/ApiServices";
import OrderCard from "../component/OrderCard";

const DeliveryPage = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock driver ID - replace with actual authentication
  const driverId = "d1";
  const driverName = "Mike Johnson";
  
  useEffect(() => {
    loadOrders();
    
    // Refresh orders every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load available orders
      const available = await apiService.getOrdersForDelivery();
      console.log("Available orders:", available); // Debug log
      setAvailableOrders(available);
      
      // Load current driver's orders
      const current = await apiService.getDriverOrders(driverId);
      console.log("My orders:", current); // Debug log
      setMyOrders(current);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const getOrderId = (order) => {
    // Try both id and _id to handle different API responses
    return order.id || order._id;
  };

  const handleAcceptDelivery = async (order) => {
    const orderId = getOrderId(order);
    if (!orderId) {
      console.error("Order ID is undefined for order:", order);
      alert("Invalid order ID");
      return;
    }

    try {
      await apiService.updateOrderStatus(orderId, "accepted_by_delivery", {
        acceptedByDeliveryId: driverId,
        deliveryName: driverName
      });
      loadOrders();
    } catch (err) {
      console.error("Error accepting delivery:", {
        message: err.message,
        response: err.response?.data,
        orderId
      });
      alert("Failed to accept delivery");
    }
  };
  
  const handleStartDelivery = async (order) => {
    const orderId = getOrderId(order);
    if (!orderId) {
      console.error("Order ID is undefined for order:", order);
      alert("Invalid order ID");
      return;
    }

    try {
      // Estimate delivery time (20-30 minutes from now)
      const now = new Date();
      const estimatedMinutes = Math.floor(Math.random() * 10) + 20;
      now.setMinutes(now.getMinutes() + estimatedMinutes);
      const estimatedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      await apiService.updateOrderStatus(orderId, "in_delivery", {
        estimatedDeliveryTime: estimatedTime
      });
      loadOrders();
    } catch (err) {
      console.error("Error starting delivery:", err);
      alert("Failed to start delivery");
    }
  };
  
  const handleCompleteDelivery = async (order) => {
    const orderId = getOrderId(order);
    if (!orderId) {
      console.error("Order ID is undefined for order:", order);
      alert("Invalid order ID");
      return;
    }

    try {
      await apiService.updateOrderStatus(orderId, "delivered");
      loadOrders();
    } catch (err) {
      console.error("Error completing delivery:", err);
      alert("Failed to complete delivery");
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
        <p className="text-gray-600">Welcome back, {driverName}</p>
        
        <div className="mt-6 border-b">
          <div className="flex space-x-8">
            <button
              className={`pb-4 font-medium ${
                activeTab === "available"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("available")}
            >
              Available Orders
              {availableOrders.length > 0 && (
                <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-1">
                  {availableOrders.length}
                </span>
              )}
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "my-deliveries"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("my-deliveries")}
            >
              My Deliveries
              {myOrders.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {myOrders.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : activeTab === "available" ? (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart size={24} className="mr-2 text-purple-500" />
              Available Orders
            </h2>
            
            {availableOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No orders available for delivery at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableOrders.map((order) => (
                  <OrderCard
                    key={getOrderId(order)}
                    order={order}
                    actions={
                      <button
                        onClick={() => handleAcceptDelivery(order)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                      >
                        Accept Delivery
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin size={24} className="mr-2 text-blue-500" />
              My Deliveries
            </h2>
            
            {myOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You don't have any active deliveries.</p>
                <button 
                  onClick={() => setActiveTab("available")}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Browse Available Orders
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myOrders.map((order) => (
                  <OrderCard
                    key={getOrderId(order)}
                    order={order}
                    actions={
                      order.status === "accepted_by_delivery" ? (
                        <button
                          onClick={() => handleStartDelivery(order)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >
                          <MapPin size={20} />
                          Start Delivery
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCompleteDelivery(order)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={20} />
                          Mark as Delivered
                        </button>
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DeliveryPage;