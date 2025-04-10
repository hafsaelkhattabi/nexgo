

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Utensils, CheckCircle, XCircle, Clock, Plus, Minus, Trash2 } from "lucide-react";

function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [address, setAddress] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
  const customerName = "customer";
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

      // keep in mind that my route is "/customer/:customerId" but it needs "customer" field, not "customerId" 
      const response = await axios.get(`${baseUrl}/orders/customer/${customerId}`);
      setOrders(response.data);
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
      setSelectedRestaurant(restaurant); // Always set the restaurant
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

    try {
      // important part : never !!!! do that mistake that the backend and frontend schemas don't match , should  Match the schema expected by your backend Order model
      const orderData = {
        customer: customerId, // Change from customerId to customer to match my schema
        customerName,
        restaurantId: restaurant._id,
        restaurantName: restaurant.name,
        address: address.trim(),
        items: cart.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: Number(item.price), // Ensure price is a number
          quantity: Number(item.quantity), // Ensure quantity is a number
        })),
        status: "Pending",
        totalPrice: Number(getTotalPrice().toFixed(2)) // Ensure totalPrice is a number
      };

      const response = await axios.post(`${baseUrl}/orders`, orderData);
      
      // Reset on success
      setCart([]);
      setAddress("");
      setIsCartOpen(false);
      await fetchOrders();
      
      alert(`Order ${response.data._id?.slice(-6) || ''} placed successfully!`);
    } catch (error) {
      console.error("Order failed:", error);
      // Extract detailed error message from response if available
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Order failed: ${errorMessage}`);
    } finally {
      setLoading(prev => ({ ...prev, placeOrder: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={24} className="text-green-600" />;
      case "Cancelled":
        return <XCircle size={24} className="text-red-600" />;
      default:
        return <Clock size={24} className="text-yellow-600" />;
    }
  };

  return (
    <div className="p-8 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#502314] mt-10">
        Welcome
      </h1>

      {/* Cart Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 flex items-center justify-center"
        >
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Restaurant List */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Utensils size={30} className="text-orange-600" />
          Available Restaurants
        </h2>
        
        {error.restaurants && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.restaurants}
          </div>
        )}
        
        {loading.restaurants ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {restaurants.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-12">No restaurants available.</p>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 transition-all transform hover:scale-105"
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
                  <h3 className="text-2xl font-semibold mt-3">{restaurant.name}</h3>
                  <p className="text-gray-600">{restaurant.address}</p>
                  <p className="text-gray-500">{restaurant.cuisine || "Various Cuisines"}</p>
                  <button
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-700"
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

      {/* Order List */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart size={30} className="text-blue-600" />
          Your Orders
        </h2>
        
        {error.orders && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.orders}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          {loading.orders ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders placed yet.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="p-4 bg-gray-100 rounded-md flex justify-between items-center border border-gray-300"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">{order.restaurantName}</h3>
                      <span className="text-sm text-gray-500">#{order._id.slice(-6)}</span>
                    </div>
                    <p className="text-gray-600">
                      Items: {order.items.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                    </p>
                    <p className="text-gray-500">Total: ${order.totalPrice?.toFixed(2) || 'N/A'}</p>
                    <p className="text-gray-500">Address: {order.address}</p>
                    <p className="text-sm text-gray-500">
                      Ordered on: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center ml-4">
                    {getStatusIcon(order.status)}
                    <span className="text-sm mt-1 capitalize">{order.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Menu Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#502314]">
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No menu items available for this restaurant.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div key={item._id} className="border rounded-lg p-4 flex justify-between items-start">
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
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 ml-2"
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
              <h2 className="text-2xl font-bold text-[#502314]">
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
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto">
                  <ul className="space-y-4">
                    {cart.map((item) => {
                      const itemRestaurant = restaurants.find(r => r._id === item.restaurantId);
                      return (
                        <li key={item._id} className="border-b pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-gray-600">${parseFloat(item.price).toFixed(2)} each</p>
                              {itemRestaurant && (
                                <p className="text-sm text-gray-500">From: {itemRestaurant.name}</p>
                              )}
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
                                className="text-red-600 ml-2"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-right font-medium">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 border-t pt-4">
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
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:bg-green-400"
                  >
                    {loading.placeOrder ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Place Order
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