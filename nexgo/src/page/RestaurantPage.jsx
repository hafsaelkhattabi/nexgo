import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import { ShoppingCart, Utensils, X, Menu, PlusCircle, ImagePlus, Trash } from "lucide-react";
import { apiService, API_BASE_URL } from "../services/ApiServices";
import OrderCard from "../component/OrderCard";

const RestaurantPage = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Menu related states
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [newItems, setNewItems] = useState([{
    name: "", 
    price: "", 
    image: null,
    description: ""
  }]);

  useEffect(() => {
    const verifyAndLoadData = async () => {
      try {
        // Authentication check
        const token = authService.getAuthToken();
        const user = authService.getUserData();
        const restaurantId = authService.getRestaurantId();

        if (!token || !user) {
          throw new Error("Authentication required");
        }

        if (user.role === 'restaurant' && !restaurantId) {
          navigate('/create-restaurant'); // Correct v6+ navigation
          toast.info("Please complete your restaurant profile");
          return;
        }

        // ... rest of your data loading logic ...

      } catch (error) {
        authService.logout();
        navigate('/login'); // Correct v6+ navigation
        toast.error("Please login again");
      }
    };

    verifyAndLoadData();
  }, [navigate]);

  // useEffect(() => {
  //   const storedId = localStorage.getItem('restaurantId');
  //   if (storedId) {
  //     setRestaurantId(storedId);
  //     return;
  //   }
    
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const urlRestaurantId = urlParams.get('restaurantId');
  //   if (urlRestaurantId) {
  //     setRestaurantId(urlRestaurantId);
  //     localStorage.setItem('restaurantId', urlRestaurantId);
  //   }
  // }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  
  //   axios
  //     .get("http://localhost:5000/restaurant", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setRestaurantData(res.data); // or however you store the restaurant info
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch restaurant data", err);
  //       navigate("/login"); // Invalid token or not logged in
  //     });
  // }, []);
  


  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantInfo();
      loadOrders();
      loadMenu();
      
      const interval = setInterval(loadOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [restaurantId]);

  const fetchRestaurantInfo = async () => {
    if (!restaurantId) return;
    
    try {
      const data = await apiService.getRestaurantById(restaurantId);
      setRestaurantInfo(data);
    } catch (err) {
      console.error("Error fetching restaurant info:", err);
      setError("Failed to load restaurant information");
    }
  };

  const loadOrders = async () => {
    if (!restaurantId) return;
    
    setLoading(true);
    setError(null);

    try {
      const allOrders = await apiService.getRestaurantOrders(restaurantId);

      const pending = allOrders.filter(
        (order) => order.status === "pending"
      );
      setPendingOrders(pending);

      const accepted = allOrders.filter(
        (order) => order.status === "accepted_by_restaurant"
      );
      setAcceptedOrders(accepted);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    if (!restaurantId) return;
    
    setMenuLoading(true);
    try {
      const menuData = await apiService.getRestaurantMenu(restaurantId);
      setMenuItems(menuData);
    } catch (err) {
      console.error("Error loading menu:", err);
      setError("Failed to load menu items");
    } finally {
      setMenuLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await apiService.updateOrderStatus(orderId, "accepted_by_restaurant");
      loadOrders();
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("Failed to accept order");
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (confirm("Are you sure you want to reject this order? This action cannot be undone.")) {
      try {
        await apiService.updateOrderStatus(orderId, "rejected_by_restaurant");
        loadOrders();
      } catch (err) {
        console.error("Error rejecting order:", err);
        alert("Failed to reject order");
      }
    }
  };

  const handleReadyForDelivery = async (orderId) => {
    try {
      await apiService.updateOrderStatus(orderId, "ready_for_delivery");
      loadOrders();
    } catch (err) {
      console.error("Error marking order as ready:", err);
      alert("Failed to update order status");
    }
  };

  // Menu management functions
  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const updatedItems = [...newItems];
      updatedItems[index].image = e.target.files[0];
      setNewItems(updatedItems);
    }
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
      setError("Restaurant ID is missing");
      return;
    }

    for (const item of newItems) {
      if (!item.name || !item.price) {
        setError("Name and price are required for all items");
        return;
      }
    }

    setMenuLoading(true);
    setError(null);

    try {
      const addPromises = newItems.map(async (item) => {
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('price', item.price);
        formData.append('description', item.description || '');
        formData.append('restaurantId', token);
      
        if (item.image) {
          formData.append('image', item.image);
        }

        return apiService.addMenuItem(formData);
      });

      await Promise.all(addPromises);
      
      setNewItems([{
        name: "", 
        price: "", 
        image: null,
        description: ""
      }]);
      
      loadMenu();
    } catch (err) {
      console.error("Error adding menu items:", err);
      setError("Failed to add menu items: " + (err.message || "Unknown error"));
    } finally {
      setMenuLoading(false);
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!itemId) {
      setError("No menu item ID provided");
      return;
    }

    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        setMenuLoading(true);
        await apiService.deleteMenuItem(itemId);
        setMenuItems(prevMenu => prevMenu.filter(item => item._id !== itemId));
      } catch (err) {
        console.error("Delete error:", err);
        setError("Failed to delete menu item");
      } finally {
        setMenuLoading(false);
      }
    }
  };

  const RestaurantSelector = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectorLoading, setSelectorLoading] = useState(false);
    
    useEffect(() => {
      const fetchRestaurants = async () => {
        setSelectorLoading(true);
        try {
          const response = await apiService.getRestaurants();
          setRestaurants(response);
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
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <p>No restaurants found. Please create a restaurant first.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
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
      <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">🍽️ Restaurant Dashboard</h1>
        
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
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {restaurantInfo ? restaurantInfo.name : 'Restaurant'} Dashboard
          </h1>
          
          <button 
            onClick={() => {
              localStorage.removeItem('restaurantId');
              setRestaurantId(null);
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Change Restaurant
          </button>
        </div>

        <div className="mt-6 border-b">
          <div className="flex space-x-8">
            <button
              className={`pb-4 font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Pending Orders
              {pendingOrders.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingOrders.length}
                </span>
              )}
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "accepted"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("accepted")}
            >
              Accepted Orders
            </button>
            <button
              className={`pb-4 font-medium ${
                activeTab === "menu"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("menu")}
            >
              <div className="flex items-center">
                <Menu size={18} className="mr-2" />
                Menu Management
              </div>
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
        {activeTab === "pending" && (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShoppingCart size={24} className="mr-2 text-orange-500" />
              Pending Orders
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : pendingOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No pending orders at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    actions={
                      <div className="flex justify-between w-full space-x-2">
                        <button
                          onClick={() => handleAcceptOrder(order._id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleRejectOrder(order._id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "accepted" && (
          <>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Utensils size={24} className="mr-2 text-blue-500" />
              Accepted Orders
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : acceptedOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No orders in preparation.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acceptedOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    actions={
                      <button
                        onClick={() => handleReadyForDelivery(order._id)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
                      >
                        Mark Ready for Delivery
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "menu" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <PlusCircle className="text-green-500 mr-2" /> Add Menu Items
              </h2>
              
              {newItems.map((item, index) => (
                <div key={`new-item-${index}`} className="space-y-3 mb-6 border-b pb-6">
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
                      rows={2}
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
                  disabled={menuLoading}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center gap-2"
                >
                  {menuLoading ? (
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
              {menuLoading && menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading menu items...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No menu items added yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
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
                            src={`${API_BASE_URL}${item.image}`}
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
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;