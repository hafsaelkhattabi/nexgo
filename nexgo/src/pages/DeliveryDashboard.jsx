
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, PackageCheck, CheckCircle, Truck, Clock, User, MapPin } from "lucide-react";

function DeliveryDashboard() {
  const [deliveryId, setDeliveryId] = useState("delivery123"); // Hardcoded for demo
  const [deliveryName, setDeliveryName] = useState("John Delivery"); // Hardcoded for demo
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("available"); // available, current, history
  const [loading, setLoading] = useState({
    available: false,
    myOrders: false,
    notifications: false
  });
  const [error, setError] = useState(null);

  // Base URL for API
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    // Initial data fetch
    fetchAvailableOrders();
    fetchMyOrders();
    fetchNotifications();
    
    // Set up polling intervals
    const availableInterval = setInterval(fetchAvailableOrders, 15000); // 15 seconds
    const myOrdersInterval = setInterval(fetchMyOrders, 15000);
    const notificationsInterval = setInterval(fetchNotifications, 30000); // 30 seconds
    
    return () => {
      clearInterval(availableInterval);
      clearInterval(myOrdersInterval);
      clearInterval(notificationsInterval);
    };
  }, [deliveryId]);

  const fetchAvailableOrders = async () => {
    setLoading(prev => ({ ...prev, available: true }));
    
    try {
      // In a real app, this endpoint would return orders ready for pickup and not assigned
      const response = await axios.get(`${baseUrl}/delivery/available-orders`);
      setAvailableOrders(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching available orders:", error);
      setError("Failed to load available orders. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, available: false }));
    }
  };

  const fetchMyOrders = async () => {
    if (!deliveryId) return;
    
    setLoading(prev => ({ ...prev, myOrders: true }));
    
    try {
      // This would fetch orders assigned to this delivery person
      const response = await axios.get(`${baseUrl}/orders/delivery/${deliveryId}`);
      setMyOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      // Don't override main error message if it exists
      if (!error) {
        setError("Failed to load your orders. Please try again.");
      }
    } finally {
      setLoading(prev => ({ ...prev, myOrders: false }));
    }
  };

  const fetchNotifications = async () => {
    if (!deliveryId) return;
    
    setLoading(prev => ({ ...prev, notifications: true }));
    
    try {
      const response = await axios.get(`${baseUrl}/notifications/delivery/${deliveryId}`);
      setNotifications(Array.isArray(response.data) ? response.data : []);
      
      // Mark notifications as read (this would need a backend endpoint)
      if (response.data.length > 0) {
        try {
          await axios.post(`${baseUrl}/notifications/mark-read`, {
            recipient: deliveryId,
            recipientType: "delivery"
          });
        } catch (markError) {
          console.error("Error marking notifications as read:", markError);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(prev => ({ ...prev, notifications: false }));
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      // First check if order is still available (not taken by another delivery person)
      const orderCheck = await axios.get(`${baseUrl}/orders/${orderId}`);
      if (orderCheck.data.deliveryId) {
        setError("This order has already been accepted by another delivery person.");
        fetchAvailableOrders(); // Refresh available orders
        return;
      }
      
      await axios.patch(`${baseUrl}/orders/${orderId}/delivery-accept`, {
        deliveryId,
        deliveryName
      });
      
      // Refresh both order lists
      fetchAvailableOrders();
      fetchMyOrders();
      
      alert(`You have accepted order #${orderId.slice(-6)}`);
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order. Please try again.");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      if (status === "Delivered") {
        await axios.patch(`${baseUrl}/orders/${orderId}/mark-delivered`);
      } else {
        await axios.patch(`${baseUrl}/orders/${orderId}/update-status`, { status });
      }
      
      // Refresh my orders
      fetchMyOrders();
      
      alert(`Order #${orderId.slice(-6)} has been marked as ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ready for Pickup":
        return <PackageCheck size={20} className="text-blue-600" />;
      case "On The Way":
        return <Truck size={20} className="text-orange-600" />;
      case "Delivered":
        return <CheckCircle size={20} className="text-green-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  // Filter orders based on active tab
  const currentContent = () => {
    switch (activeTab) {
      case "available":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Orders</h2>
            {loading.available ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading available orders...</p>
              </div>
            ) : availableOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <PackageCheck size={48} className="mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">No orders available for pickup at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin size={16} className="mr-1" />
                          <span>{order.deliveryAddress.substring(0, 45)}{order.deliveryAddress.length > 45 ? '...' : ''}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="flex items-center text-blue-600">
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                          <span className="mx-2">•</span>
                          <span>{order.items.length} items</span>
                          <span className="mx-2">•</span>
                          <span>{order.distance ? `${order.distance} miles` : 'Distance N/A'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "current":
        const activeOrders = myOrders.filter(order => order.status !== "Delivered");
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Current Orders</h2>
            {loading.myOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your orders...</p>
              </div>
            ) : activeOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Truck size={48} className="mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">You don't have any active orders.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <User size={16} className="mr-1" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin size={16} className="mr-1" />
                          <span>{order.deliveryAddress.substring(0, 45)}{order.deliveryAddress.length > 45 ? '...' : ''}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="flex items-center text-blue-600">
                            {getStatusIcon(order.status)}
                            <span className="ml-1">{order.status}</span>
                          </span>
                          <span className="mx-2">•</span>
                          <span>{order.items.length} items</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {order.status === "Ready for Pickup" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "On The Way")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Picked Up
                          </button>
                        )}
                        {order.status === "On The Way" && (
                          <button
                            onClick={() => updateOrderStatus(order.id, "Delivered")}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "history":
        const completedOrders = myOrders.filter(order => order.status === "Delivered");
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery History</h2>
            {loading.myOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your delivery history...</p>
              </div>
            ) : completedOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <CheckCircle size={48} className="mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">You haven't completed any deliveries yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <User size={16} className="mr-1" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin size={16} className="mr-1" />
                          <span>{order.deliveryAddress.substring(0, 45)}{order.deliveryAddress.length > 45 ? '...' : ''}</span>
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1" />
                            <span>Delivered</span>
                          </span>
                          <span className="mx-2">•</span>
                          <span>{new Date(order.deliveredAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Delivery Dashboard</h1>
            <p className="text-gray-600">Welcome back</p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={24} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-start">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
            <button 
              className="ml-auto text-red-700 hover:text-red-800" 
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">Available Orders</h3>
            <p className="text-2xl font-bold text-blue-900">{availableOrders.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800">Active Deliveries</h3>
            <p className="text-2xl font-bold text-orange-900">
              {myOrders.filter(order => order.status !== "Delivered").length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Completed Today</h3>
            <p className="text-2xl font-bold text-green-900">
              {myOrders.filter(order => {
                if (order.status !== "Delivered") return false;
                const today = new Date().toDateString();
                const orderDate = new Date(order.deliveredAt).toDateString();
                return today === orderDate;
              }).length}
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b mb-6">
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
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "current"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("current")}
            >
              Current Orders
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "history"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {currentContent()}
      </div>
    </div>
  );
}

export default DeliveryDashboard;