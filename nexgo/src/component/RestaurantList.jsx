import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import RestaurantCard from "./RestaurantCard";
import { ThemeContext } from "../context/ThemeContext";
function RestaurantList() {
  const { darkMode } = useContext(ThemeContext); // Use the ThemeContext
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/restaurants`);
        
        const restaurantsWithMenus = await Promise.all(
          response.data.map(async (restaurant) => {
            try {
              const menuResponse = await axios.get(`${baseUrl}/menu/${restaurant._id}`);
              return {
                ...restaurant,
                menuItems: menuResponse.data
              };
            } catch (menuError) {
              console.error(`Error fetching menu for ${restaurant.name}:`, menuError);
              return {
                ...restaurant,
                menuItems: []
              };
            }
          })
        );
        
        setRestaurants(restaurantsWithMenus);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const placeOrder = async () => {
    if (!customerName || cart.length === 0) {
      alert("Please enter your name and add items to cart.");
      return;
    }

    const orderData = {
      customerName,
      restaurantId: selectedRestaurant._id,
      items: cart.map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1
      }))
    };

    try {
      await axios.post(`${baseUrl}/restaurants/orders`, orderData);
      alert("Order placed successfully!");
      setSelectedRestaurant(null);
      setCustomerName("");
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };

  if (error) {
    return <div className={`p-4 text-red-500 ${darkMode ? 'dark:text-red-400' : ''}`}>Error: {error}</div>;
  }

  if (loading) {
    return <div className={`p-4 text-center ${darkMode ? 'dark:text-gray-300' : ''}`}>Loading restaurants...</div>;
  }

  return (
    <div className={`p-8 mt-10 ${darkMode ? 'dark:bg-gray-900' : 'bg-[#f8f1e7]'} transition-colors duration-300`}>
      <h1 className={`text-4xl font-bold mb-8 text-center ${darkMode ? 'dark:text-gray-100' : 'text-[#502314]'} mt-20`}>Restaurants</h1>

      {restaurants.length === 0 ? (
        <p className={`text-center ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant._id}
              restaurant={restaurant}
              baseUrl={baseUrl}
              darkMode={darkMode}
              onAddToCart={(item) => {
                setSelectedRestaurant(restaurant);
                addToCart(item);
              }}
            />
          ))}
        </div>
      )}

      {selectedRestaurant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'dark:bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'dark:text-gray-100' : 'text-[#502314]'}`}>
              {selectedRestaurant.name} - Menu
            </h2>
            
            <div className="mb-4">
              <h3 className={`font-medium mb-2 ${darkMode ? 'dark:text-gray-200' : ''}`}>Menu Items</h3>
              {selectedRestaurant.menuItems.length === 0 ? (
                <p className={`${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>No menu items available</p>
              ) : (
                <div className="space-y-3">
                  {selectedRestaurant.menuItems.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-3 border rounded ${darkMode ? 'dark:border-gray-700 dark:bg-gray-700' : ''}`}>
                      <div>
                        <p className={`font-medium ${darkMode ? 'dark:text-gray-200' : ''}`}>{item.name}</p>
                        <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-600'}`}>${item.price}</p>
                        {item.description && (
                          <p className={`text-xs mt-1 ${darkMode ? 'dark:text-gray-500' : 'text-gray-500'}`}>{item.description}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <input
                type="text"
                placeholder="Your Name"
                className={`border p-2 rounded w-full mb-3 ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400' : ''}`}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              
              <h3 className={`font-medium mb-2 ${darkMode ? 'dark:text-gray-200' : ''}`}>Your Cart</h3>
              {cart.length === 0 ? (
                <p className={`mb-3 ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>No items in cart</p>
              ) : (
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className={`flex justify-between items-center p-2 border-b ${darkMode ? 'dark:border-gray-700' : ''}`}>
                      <div>
                        <p className={`${darkMode ? 'dark:text-gray-200' : ''}`}>{item.name}</p>
                        <p className={`text-sm ${darkMode ? 'dark:text-gray-400' : 'text-gray-500'}`}>${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className={`${darkMode ? 'dark:text-red-400 hover:dark:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className={`font-bold mt-2 ${darkMode ? 'dark:text-gray-200' : ''}`}>
                    Total: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button 
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" 
                  onClick={() => {
                    setSelectedRestaurant(null);
                    setCart([]);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300" 
                  onClick={placeOrder}
                  disabled={cart.length === 0}
                >
                  Place Order (${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantList;