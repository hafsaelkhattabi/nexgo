import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, ClipboardList, Trash, PlusCircle, ImagePlus } from "lucide-react";

function RestaurantDashboard() {
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [menu, setMenu] = useState([]);
  const [newItems, setNewItems] = useState([{
    name: "", 
    price: "", 
    image: null,
    description: ""
  }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('restaurantId');
    if (storedId) {
      setRestaurantId(storedId);
      return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlRestaurantId = urlParams.get('restaurantId');
    if (urlRestaurantId) {
      setRestaurantId(urlRestaurantId);
      localStorage.setItem('restaurantId', urlRestaurantId);
    }
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantInfo();
      fetchMenu();
      fetchOrders();
      fetchNotifications();
    }
  }, [restaurantId]);

  const fetchRestaurantInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/restaurants/${restaurantId}`);
      setRestaurantInfo(response.data);
    } catch (err) {
      console.error("Error fetching restaurant info:", err);
      setError("Failed to load restaurant information");
    }
  };

  const fetchMenu = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/menu/${restaurantId}`);
      setMenu(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError(err.response?.data?.message || "Failed to load menu");
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!restaurantId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/orders/restaurant/${restaurantId}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    }
  };

  const fetchNotifications = async () => {
    if (!restaurantId) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/notifications/restaurant/${restaurantId}`);
      setNotifications(response.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    }
  };

  const handleImageChange = (e, index) => {
    const updatedItems = [...newItems];
    updatedItems[index].image = e.target.files[0];
    setNewItems(updatedItems);
  };

  const addNewItemField = () => {
    setNewItems([...newItems, {
      name: "", 
      price: "", 
      image: null,
      description: ""
    }]);
  };

  const removeItemField = (index) => {
    if (newItems.length <= 1) return;
    const updatedItems = [...newItems];
    updatedItems.splice(index, 1);
    setNewItems(updatedItems);
  };

  const handleItemChange = (e, index, field) => {
    const updatedItems = [...newItems];
    updatedItems[index][field] = e.target.value;
    setNewItems(updatedItems);
  };

  const addMenuItems = async () => {
    if (!restaurantId) {
      setError("Restaurant ID is missing. Please select a restaurant first.");
      return;
    }

    for (const item of newItems) {
      if (!item.name || !item.price) {
        setError("Name and price are required for all items");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const addPromises = newItems.map(async (item) => {
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('price', item.price);
        formData.append('description', item.description || '');
        formData.append('restaurantId', restaurantId);
      
        if (item.image) {
          formData.append('image', item.image);
        }

        return axios.post("http://localhost:5000/menu", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      });

      await Promise.all(addPromises);
      
      setNewItems([{
        name: "", 
        price: "", 
        image: null,
        description: ""
      }]);
      await fetchMenu();
    } catch (err) {
      console.error("Error adding menu items:", err);
      if (err.response) {
        setError(err.response.data.message || err.response.data.error || "Failed to add menu items");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    if (!id) {
      setError("No menu item ID provided");
      return;
    }

    try {
      const userConfirmed = window.confirm("Are you sure you want to delete this menu item?");
      if (!userConfirmed) return;

      setLoading(true);
      
      const response = await axios.delete(`http://localhost:5000/menu/${id}`, {
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 200) {
        setMenu(prevMenu => prevMenu.filter(item => item._id !== id));
      } else if (response.status === 404) {
        setError("Menu item not found - it may have already been deleted");
      } else {
        setError(response.data?.message || "Failed to delete menu item");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  const RestaurantSelector = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectorLoading, setSelectorLoading] = useState(false);
    
    useEffect(() => {
      const fetchRestaurants = async () => {
        setSelectorLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/restaurants');
          setRestaurants(response.data);
        } catch (err) {
          console.error("Error fetching restaurants:", err);
        } finally {
          setSelectorLoading(false);
        }
      };
      
      fetchRestaurants();
    }, []);
    
    const selectRestaurant = (id) => {
      setRestaurantId(id);
      localStorage.setItem('restaurantId', id);
    };
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Select a Restaurant</h2>
        {selectorLoading ? (
          <p>Loading restaurants...</p>
        ) : restaurants.length === 0 ? (
          <p>No restaurants found. Please create a restaurant first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map(restaurant => (
              <div 
                key={restaurant._id}
                className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => selectRestaurant(restaurant._id)}
              >
                <h3 className="font-medium">{restaurant.name}</h3>
                <p className="text-sm text-gray-500">{restaurant.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!restaurantId) {
    return (
      <div className="p-8 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-[#502314]">🍽️ Restaurant Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <RestaurantSelector />
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-[#502314]">
        🍽️ {restaurantInfo ? restaurantInfo.name : 'Restaurant'} Dashboard
      </h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Restaurant ID: {restaurantId}</p>
          {restaurantInfo && (
            <p className="text-sm text-gray-500">{restaurantInfo.address}</p>
          )}
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('restaurantId');
            setRestaurantId("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          Change Restaurant
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="text-yellow-500" /> Notifications
            </h2>
            {notifications.length === 0 ? (
              <p className="text-gray-500 mt-2">No new notifications.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {notifications.map((n) => (
                  <li key={n._id} className="p-2 bg-gray-50 border rounded-md">{n.message}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ClipboardList className="text-green-500" /> Orders
            </h2>

            {orders.length === 0 ? (
              <p className="text-gray-500 mt-2">No new orders.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {orders.map((order) => (
                  <li key={order._id} className="p-3 bg-gray-50 border rounded-md space-y-1">
                    <p>
                      <span className="font-medium text-gray-700">Order from:</span>
                      <span className="font-semibold ml-2">{order.customerId}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Items:</span>
                      <span className="ml-2">
                        {order.items.map(item => item.name).join(", ")}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2">{order.status}</span>
                    </p>
                    {order.createdAt && (
                      <p className="text-sm text-gray-400">
                        Ordered at: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="text-green-500" /> Add Menu Items
            </h2>
            
            {newItems.map((item, index) => (
              <div key={index} className="space-y-3 mb-6 border-b pb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Menu Item #{index + 1}</h3>
                  {index > 0 && (
                    <button 
                      onClick={() => removeItemField(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Margherita Pizza"
                    value={item.name}
                    onChange={(e) => handleItemChange(e, index, 'name')}
                    className="border p-2 w-full rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12.99"
                    value={item.price}
                    onChange={(e) => handleItemChange(e, index, 'price')}
                    className="border p-2 w-full rounded"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Brief description of the item"
                    value={item.description}
                    onChange={(e) => handleItemChange(e, index, 'description')}
                    className="border p-2 w-full rounded"
                    rows="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                  <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border border-dashed cursor-pointer">
                    <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {item.image ? item.image.name : "Click to upload image"}
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleImageChange(e, index)}
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button
                onClick={addNewItemField}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Another Item
              </button>
              
              <button 
                onClick={addMenuItems}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Items...
                  </>
                ) : (
                  `Add ${newItems.length > 1 ? 'All Items' : 'Item'}`
                )}
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Your Menu Items</h2>
            {loading && menu.length === 0 ? (
              <p className="text-gray-500">Loading menu items...</p>
            ) : menu.length === 0 ? (
              <p className="text-gray-500">No menu items added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {menu.map((item) => (
                  <div key={item._id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-bold">{item.name}</p>
                        <p className="text-gray-500">${item.price}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteMenuItem(item._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete item"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                    {item.image && (
                      <div className="mt-3">
                        <img 
                          src={`http://localhost:5000${item.image}`} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;

