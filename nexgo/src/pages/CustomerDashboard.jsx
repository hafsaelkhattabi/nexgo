

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Utensils, CheckCircle, XCircle, Clock, Plus, Minus, Trash2, User, MapPin } from "lucide-react";

function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [address, setAddress] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants"); // restaurants, orders
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState({
    restaurants: false,
    menu: false,
    orders: false,
    placeOrder: false
  });
  const [error, setError] = useState({
    restaurants: null,
    menu: null,
    orders: null,
    placeOrder: null
  });

  // User details - replace with your actual authentication
  const customerName = "Customer";
  const customerId = "123";
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(prev => ({ ...prev, restaurants: true }));
    setError(prev => ({ ...prev, restaurants: null }));
    
    try {
      const response = await axios.get(`${baseUrl}/restaurants`);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError(prev => ({ ...prev, restaurants: "Failed to load restaurants" }));
    } finally {
      setLoading(prev => ({ ...prev, restaurants: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    setError(prev => ({ ...prev, orders: null }));
    
    try {
      const response = await axios.get(`${baseUrl}/orders/customer/${customerId}`);
      
      // Sort orders by date (newest first)
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(prev => ({ ...prev, orders: "Failed to load orders" }));
      // Initialize with empty array to prevent errors
      setOrders([]);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    setLoading(prev => ({ ...prev, menu: true }));
    setError(prev => ({ ...prev, menu: null }));
    
    try {
      const response = await axios.get(`${baseUrl}/menu/${restaurantId}`);
      const restaurant = restaurants.find(r => r._id === restaurantId);
      
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }

      // Add restaurant info to each menu item
      const itemsWithRestaurant = response.data.map(item => ({
        ...item,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name
      }));

      setMenuItems(itemsWithRestaurant);
      setSelectedRestaurant(restaurant);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setError(prev => ({ ...prev, menu: "Failed to load menu" }));
    } finally {
      setLoading(prev => ({ ...prev, menu: false }));
    }
  };

  const addToCart = (item) => {
    if (!item.restaurantId) {
      console.error("Menu item missing restaurantId:", item);
      return;
    }

    setCart(prevCart => {
      // If cart has items from different restaurant
      if (prevCart.length > 0 && prevCart[0].restaurantId !== item.restaurantId) {
        if (window.confirm("Your cart contains items from another restaurant. Start new order?")) {
          return [{ ...item, quantity: 1 }];
        }
        return prevCart;
      }

      // Normal add to cart logic
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const placeOrder = async () => {
    // Validate cart
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate address
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    // Get restaurant info - either from selectedRestaurant or first cart item
    const restaurant = selectedRestaurant || restaurants.find(r => r._id === cart[0]?.restaurantId);
    
    if (!restaurant) {
      alert("Cannot determine restaurant. Please add items again.");
      return;
    }

    setLoading(prev => ({ ...prev, placeOrder: true }));
    setError(prev => ({ ...prev, placeOrder: null }));

    try {
      const orderData = {
        customer: customerId,
        customerName,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        address: address.trim(),
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })),
        status: "Pending",
        totalPrice: Number(getTotalPrice().toFixed(2))
      };

      const response = await axios.post(`${baseUrl}/orders`, orderData);
      
      // Reset on success
      setCart([]);
      setAddress("");
      setIsCartOpen(false);
      await fetchOrders();
      setActiveTab("orders"); // Switch to orders tab to see the new order
      
      alert(`Order ${response.data._id?.slice(-6) || ''} placed successfully!`);
    } catch (error) {
      console.error("Order failed:", error);
      // Extract detailed error message from response if available
      const errorMessage = error.response?.data?.message || error.message;
      setError(prev => ({ ...prev, placeOrder: `Order failed: ${errorMessage}` }));
    } finally {
      setLoading(prev => ({ ...prev, placeOrder: false }));
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(`${baseUrl}/orders/${orderId}/cancel`, {
        customerId
      });
      
      // Refresh orders
      fetchOrders();
      
      alert(`Order #${orderId.slice(-6)} has been cancelled.`);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Preparing":
        return <Clock size={20} className="text-yellow-600" />;
      case "Ready for Pickup":
        return <ShoppingCart size={20} className="text-blue-600" />;
      case "On The Way":
        return <Utensils size={20} className="text-orange-600" />;
      case "Delivered":
        return <CheckCircle size={20} className="text-green-600" />;
      case "Cancelled":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  const getOrderStatusPercentage = (status) => {
    switch (status) {
      case "Pending":
        return 10;
      case "Preparing":
        return 25;
      case "Ready for Pickup":
        return 50;
      case "On The Way":
        return 75;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customer Dashboard</h1>
            <p className="text-gray-600">Welcome back </p>
          </div>
          
          {/* Cart Button */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-orange-500 text-white p-3 rounded-full shadow hover:bg-orange-600 flex items-center justify-center"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b">
          <div className="flex space-x-8">
            <button
              className={`pb-4 font-medium ${
                activeTab === "restaurants"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("restaurants")}
            >
              Restaurants
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "orders"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "restaurants" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Utensils size={24} className="mr-2 text-orange-500" />
              Available Restaurants
            </h2>
            
            {error.restaurants && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.restaurants}
              </div>
            )}
            
            {loading.restaurants ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading restaurants...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.length === 0 ? (
                  <p className="text-gray-500 col-span-full text-center py-12">No restaurants available.</p>
                ) : (
                  restaurants.map((restaurant) => (
                    <div
                      key={restaurant._id}
                      className="border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        {restaurant.image ? (
                          <img
                            src={`${baseUrl}${restaurant.image}`}
                            alt={restaurant.name}
                            className="w-full h-48 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                            <Utensils size={48} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mt-3">{restaurant.name}</h3>
                      <p className="text-gray-600">{restaurant.address}</p>
                      <p className="text-gray-500 mb-3">{restaurant.cuisine || "Various Cuisines"}</p>
                      <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2"
                        onClick={() => fetchMenuItems(restaurant._id)}
                      >
                        <Utensils size={20} />
                        View Menu
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart size={24} className="mr-2 text-blue-500" />
              Your Orders
            </h2>
            
            {error.orders && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.orders}
              </div>
            )}
            
            {loading.orders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingCart size={48} className="mx-auto text-gray-400" />
                <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
                <button 
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                  onClick={() => setActiveTab("restaurants")}
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 flex justify-between items-start border-b">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">Order #{order._id.slice(-6)}</h3>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{order.restaurantName}</span>
                        </div>
                        <p className="text-sm text-gray-500">{formatOrderDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="flex items-center mr-3">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 text-sm font-medium">{order.status}</span>
                        </span>
                        <button 
                          onClick={() => toggleOrderDetails(order._id)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        >
                          {expandedOrderId === order._id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                    
                    {/* Progress Tracker for Active Orders */}
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <div className="px-4 py-3 bg-gray-50">
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                Order Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {getOrderStatusPercentage(order.status)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex h-2 mb-2 overflow-hidden rounded bg-gray-200">
                            <div
                              style={{ width: `${getOrderStatusPercentage(order.status)}%` }}
                              className="flex flex-col justify-center rounded bg-blue-500"
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Pending</span>
                            <span>Preparing</span>
                            <span>Ready</span>
                            <span>On the Way</span>
                            <span>Delivered</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Expanded Order Details */}
                    {expandedOrderId === order._id && (
                      <div className="p-4 bg-gray-50">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Delivery Information</h4>
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-start mb-2">
                              <MapPin size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{order.address}</span>
                            </div>
                            {order.deliveryPerson && (
                              <div className="flex items-center">
                                <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span className="text-sm">Delivery by: {order.deliveryPerson}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Order Items</h4>
                          <div className="bg-white rounded border">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Item
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Qty
                                  </th>
                                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      {item.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td colSpan="2" className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                                    Total:
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                                    ${order.totalPrice?.toFixed(2) || '0.00'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Cancel button - only for pending or preparing orders */}
                        {(order.status === "Pending" || order.status === "Preparing") && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Menu Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedRestaurant.name} Menu
              </h2>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {error.menu && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.menu}
              </div>
            )}
            
            {loading.menu ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No menu items available for this restaurant.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div key={item._id} className="border rounded-lg p-4 flex justify-between items-start hover:bg-gray-50">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
                      {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                      {item.image && (
                        <img 
                          src={`${baseUrl}${item.image}`} 
                          alt={item.name}
                          className="mt-2 w-24 h-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 ml-2"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Shopping Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error.placeOrder && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.placeOrder}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center py-8">
                <ShoppingCart size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab("restaurants");
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto mb-4">
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item._id} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
                            <p className="text-sm text-gray-500">From: {item.restaurantName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="bg-gray-200 p-1 rounded"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="bg-gray-200 p-1 rounded"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-red-500 ml-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-right font-medium mt-1">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Enter your delivery address"
                      className="border p-2 rounded w-full"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading.placeOrder}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 flex items-center justify-center gap-2 disabled:bg-green-400"
                  >
                    {loading.placeOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;