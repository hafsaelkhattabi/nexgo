import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, PackageCheck } from "lucide-react";

function DeliveryDashboard({ deliveryPersonId }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch pending orders and notifications
  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/delivery/pending-orders");
        // Ensure we're setting an array
        setPendingOrders(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        setError("Failed to load orders. Please try again.");
        setPendingOrders([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notifications/delivery/${deliveryPersonId}`);
        // Make sure notifications is always an array
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchPendingOrders();
    fetchNotifications();
  }, [deliveryPersonId]);

  // Accept Order
  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.patch(`/orders/${orderId}/accept`, { deliveryId: deliveryPersonId });
      // Refresh the pending orders
      const res = await axios.get("/delivery/pending-orders");
      setPendingOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order. Please try again.");
    }
  };

  // Update Order Status (e.g., mark as delivered)
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await axios.patch(`/orders/${orderId}/update-status`, { status });
      // Refresh the pending orders
      const res = await axios.get("/delivery/pending-orders");
      setPendingOrders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">🚚 Delivery Dashboard</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
          <button 
            className="text-sm underline mt-1" 
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="text-yellow-500" /> Notifications
        </h2>
        {!Array.isArray(notifications) || notifications.length === 0 ? (
          <p className="text-gray-500 mt-2">No new notifications.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {notifications.map((n, index) => (
              <li key={n._id || index} className="p-2 bg-gray-50 border rounded-md">
                {n.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pending Orders */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PackageCheck className="text-blue-500" /> Pending Orders
        </h2>
        {loading ? (
          <p className="text-gray-500 mt-2">Loading orders...</p>
        ) : !Array.isArray(pendingOrders) || pendingOrders.length === 0 ? (
          <p className="text-gray-500 mt-2">No pending orders.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {pendingOrders.map((order, index) => (
              <li key={order._id || index} className="p-4 bg-gray-50 border rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">
                    Order #{(order._id && order._id.substring(0, 8)) || index}
                  </h3>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    {order.status || "Pending"}
                  </span>
                </div>
                
                <div className="mb-3">
                  <p>
                    <span className="font-semibold">Customer:</span> {order.customerName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Restaurant:</span> {order.restaurantName || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {order.address || "N/A"}
                  </p>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Accept Order
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(order._id, "Delivered")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Mark Delivered
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DeliveryDashboard;
