import React, { useEffect, useState } from "react";
import { 
  ShoppingCart, Utensils, CheckCircle, XCircle, Clock, 
  Plus, Minus, Trash2, User, MapPin, RefreshCw, LogOut
} from "lucide-react";
import { apiService, API_BASE_URL } from "../services/ApiServices";
import OrderCard from "../component/OrderCard";

const CustomerPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState({
    restaurants: false,
    menu: false,
    orders: false,
    placeOrder: false,
    refreshing: false
  });
  const [error, setError] = useState({
    restaurants: null,
    menu: null,
    orders: null,
    placeOrder: null
  });
  
  // Mock user - replace with your auth system
  const customerId = "c1";
  const customerName = "John Doe";
  
  useEffect(() => {
    fetchRestaurants();
    fetchOrders();
    
    // Set up polling for order updates
    const pollInterval = setInterval(fetchOrders, 30000); // Update every 30 seconds
    
    return () => clearInterval(pollInterval);
  }, []);

  const handleLogout = () => {
    // Clear any auth tokens from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('customerId');
    // Redirect to home page
    window.location.href = '/';
  };

  const fetchRestaurants = async () => {
    setLoading(prev => ({ ...prev, restaurants: true }));
    setError(prev => ({ ...prev, restaurants: null }));
    
    try {
      const data = await apiService.getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError(prev => ({ ...prev, restaurants: "Failed to load restaurants" }));
    } finally {
      setLoading(prev => ({ ...prev, restaurants: false }));
    }
  };
  
  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true, refreshing: true }));
    setError(prev => ({ ...prev, orders: null }));
    
    try {
      const data = await apiService.getCustomerOrders(customerId);
      
      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(prev => ({ ...prev, orders: "Failed to load orders" }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false, refreshing: false }));
    }
  };

  const refreshOrders = () => {
    fetchOrders();
  };
  
  const fetchMenuItems = async (restaurantId) => {
    setLoading(prev => ({ ...prev, menu: true }));
    setError(prev => ({ ...prev, menu: null }));
    
    try {
      const data = await apiService.getMenuItems(restaurantId);
      setMenuItems(data);
      
      const restaurant = restaurants.find(r => r._id === restaurantId);
      setSelectedRestaurant(restaurant);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(prev => ({ ...prev, menu: "Failed to load menu" }));
    } finally {
      setLoading(prev => ({ ...prev, menu: false }));
    }
  };
  
  const addToCart = (item) => {
    // Make sure to track which restaurant this item belongs to
    const itemWithRestaurantId = {
      ...item,
      restaurantId: selectedRestaurant._id
    };
    
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...itemWithRestaurantId, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };
  
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Please add items to your cart before placing an order");
      return;
    }
    
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }
    
    setLoading(prev => ({ ...prev, placeOrder: true }));
    setError(prev => ({ ...prev, placeOrder: null }));
    
    try {
      // Check if we have items from the same restaurant
      const restaurantId = cart[0].restaurantId;
      if (!restaurantId) {
        throw new Error("Restaurant ID is missing from cart items");
      }
      
      // Find the restaurant from the restaurants array using the restaurantId
      const restaurant = restaurants.find(r => r._id === restaurantId);
      
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
      
      const orderData = {
        customerId,
        customerName,
        customerAddress: address,
        customerPhone: "123-456-7890", // You might want to get this from user input
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity)
        })),
        totalAmount: Number(getTotalPrice().toFixed(2))
      };
      
      console.log("Placing order with data:", orderData);
      await apiService.createOrder(orderData);
      
      setCart([]);
      setAddress("");
      setIsCartOpen(false);
      await fetchOrders();
      setActiveTab("orders");
      
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Order failed:", err);
      setError(prev => ({ ...prev, placeOrder: `Failed to place order: ${err.message}` }));
      alert(`Failed to place order: ${err.message}`);
    } finally {
      setLoading(prev => ({ ...prev, placeOrder: false }));
    }
  };
  
  const cancelOrder = async (orderId) => {
    try {
      await apiService.cancelOrder(orderId, customerId);
      fetchOrders();
      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order");
    }
  };
  
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted_by_restaurant":
        return <Utensils size={20} className="text-blue-600" />;
      case "ready_for_delivery":
        return <ShoppingCart size={20} className="text-purple-600" />;
      case "in_delivery":
        return <MapPin size={20} className="text-orange-600" />;
      case "delivered":
        return <CheckCircle size={20} className="text-green-600" />;
      case "rejected_by_restaurant":
      case "cancelled":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  const getOrderStatusPercentage = (status) => {
    const statusWeights = {
      "pending": 10,
      "accepted_by_restaurant": 30,
      "ready_for_delivery": 60,
      "accepted_by_delivery": 70,
      "in_delivery": 85,
      "delivered": 100,
      "rejected_by_restaurant": 0,
      "cancelled": 0
    };
    return statusWeights[status] || 0;
  };
  
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusTimeline = (order) => {
    const statuses = [
      { status: "pending", label: "Order Placed", icon: <Clock size={16} /> },
      { status: "accepted_by_restaurant", label: "Preparing", icon: <Utensils size={16} /> },
      { status: "ready_for_delivery", label: "Ready", icon: <ShoppingCart size={16} /> },
      { status: "in_delivery", label: "On The Way", icon: <MapPin size={16} /> },
      { status: "delivered", label: "Delivered", icon: <CheckCircle size={16} /> }
    ];

    if (order.status === "rejected_by_restaurant" || order.status === "cancelled") {
      return [
        ...statuses,
        { status: order.status, label: "Cancelled", icon: <XCircle size={16} /> }
      ];
    }

    return statuses.map((s) => {
      const statusUpdate = order.statusUpdates?.find(update => update.status === s.status);
      
      return {
        ...s,
        active: order.status === s.status,
        completed: getOrderStatusPercentage(order.status) > getOrderStatusPercentage(s.status),
        date: statusUpdate ? formatOrderDate(statusUpdate.timestamp) : null
      };
    });
  };
  
  const getStatusLabel = (status) => {
    const statusLabels = {
      "pending": "Pending",
      "accepted_by_restaurant": "Preparing",
      "ready_for_delivery": "Ready for Pickup",
      "accepted_by_delivery": "Delivery Accepted",
      "in_delivery": "On The Way",
      "delivered": "Delivered",
      "rejected_by_restaurant": "Rejected",
      "cancelled": "Cancelled"
    };
    return statusLabels[status] || status;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customer Dashboard</h1>
            <p className="text-gray-600">Welcome back,</p>
          </div>
    
          <div className="flex items-center gap-4">
            {activeTab === "orders" && (
              <button 
                onClick={refreshOrders}
                disabled={loading.refreshing}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                <RefreshCw size={16} className={loading.refreshing ? "animate-spin" : ""} />
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : "Refresh"}
              </button>
            )}
            
            <div className="flex items-center gap-3">
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
  <button 
    onClick={handleLogout}
    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
  >
    <LogOut size={18} />
    <span>Sign Out</span>
  </button>
</div>
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
                            src={`${API_BASE_URL}${restaurant.image}`}
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
            
            {loading.orders && !loading.refreshing ? (
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
                  <div key={order.id} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 flex justify-between items-start border-b">
                      <div>
                        <div className="flex items-center">
                        <h3 className="font-medium">
  Order #{order?.id?.slice(-6) || order?._id?.slice(-6) || 'N/A'}
</h3>
                          <span className="mx-2">•</span>
                          <span className="text-gray-600">{order.restaurantName}</span>
                        </div>
                        <p className="text-sm text-gray-500">{formatOrderDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="flex items-center mr-3">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 text-sm font-medium">{getStatusLabel(order.status)}</span>
                        </span>
                        <button 
                          onClick={() => toggleOrderDetails(order.id)}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                        >
                          {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                    
                    {/* Enhanced Progress Tracker */}
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
                      </div>
                      
                      {/* Status Timeline */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          {getStatusTimeline(order).map((s, index) => (
                            <div 
                              key={s.status} 
                              className={`flex flex-col items-center ${index !== 0 ? 'flex-grow' : ''}`}
                            >
                              <div className={`relative w-full flex justify-center ${index !== 0 ? 'pl-2' : ''}`}>
                                {index !== 0 && (
                                  <div className={`absolute h-0.5 top-3 left-0 right-1/2 ${
                                    s.completed ? 'bg-green-500' : 'bg-gray-200'
                                  }`}></div>
                                )}
                                {index !== getStatusTimeline(order).length - 1 && (
                                  <div className={`absolute h-0.5 top-3 left-1/2 right-0 ${
                                    s.completed ? 'bg-green-500' : s.active ? 'bg-blue-200' : 'bg-gray-200'
                                  }`}></div>
                                )}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 relative z-10 ${
                                  s.completed ? 'bg-green-500 text-white' : 
                                  s.active ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}>
                                  {s.icon}
                                </div>
                              </div>
                              <span className={`text-center ${s.active ? 'font-medium text-blue-600' : ''}`}>
                                {s.label}
                              </span>
                              {s.date && (
                                <span className="text-xs text-gray-500 mt-1 text-center">{s.date}</span>
                              )}
                              {s.active && !s.date && (
                                <span className="text-xs text-blue-500 mt-1">In progress</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded Order Details */}
                    {expandedOrderId === order.id && (
                      <div className="p-4 bg-gray-50 border-t">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Delivery Information</h4>
                          <div className="bg-white p-3 rounded border">
                            <div className="flex items-start mb-2">
                              <MapPin size={16} className="mr-2 text-gray-500 mt-1 flex-shrink-0" />
                              <span className="text-sm">{order.customerAddress}</span>
                            </div>
                            {order.deliveryName && (
                              <div className="flex items-center">
                                <User size={16} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span className="text-sm">Delivery by: {order.deliveryName}</span>
                                {order.estimatedDeliveryTime && (
                                  <span className="ml-4 text-sm text-blue-600">
                                    Estimated: {order.estimatedDeliveryTime}
                                  </span>
                                )}
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
                                {order.items.map((item) => (
                                  <tr key={item.id}>
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
                                  <td colSpan={2} className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                                    Total:
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                                    ${order.totalAmount.toFixed(2)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Cancel Order button */}
                        {(order.status === "pending" || order.status === "accepted_by_restaurant") && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => cancelOrder(order.id)}
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.length === 0 ? (
                  <p className="text-center py-8 text-gray-500 col-span-full">No menu items available for this restaurant.</p>
                ) : (
                  menuItems.map((item) => (
                    <div key={item._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {item.image && (
                        <div className="relative h-48 w-full">
                          <img 
                            src={`${API_BASE_URL}${item.image}`} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback for image loading errors
                              const target = e.target;
                              target.onerror = null;
                              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-700 font-medium">${parseFloat(item.price).toFixed(2)}</p>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 ml-2 flex items-center justify-center"
                            title="Add to cart"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                          <div className="flex items-start">
                            {item.image && (
                              <img 
                                src={`${API_BASE_URL}${item.image}`} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded mr-3"
                                onError={(e) => {
                                  // Fallback for image loading errors
                                  const target = e.target;
                                  target.onerror = null;
                                  target.src = 'https://via.placeholder.com/64?text=X';
                                }}
                              />
                            )}
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
                            </div>
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
                          ${(item.price * item.quantity).toFixed(2)}
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
};

export default CustomerPage;