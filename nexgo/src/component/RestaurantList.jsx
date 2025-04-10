// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function RestaurantList() {
//   const [restaurants, setRestaurants] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/restaurants")
//       .then((response) => {
//         setRestaurants(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching restaurants:", error);
//         setError(error.message);
//       });
//   }, []);

//   if (error) {
//     return <div className="p-4 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-8 mt-10">
//       <h1 className="text-4xl font-bold mb-8 text-center text-[#502314] mt-20">Restaurants</h1>
//       {restaurants.length === 0 ? (
//         <p className="text-gray-500 text-center">No restaurants found.</p>
//       ) : (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {restaurants.map((restaurant) => (
//             <li
//               key={restaurant._id}
//               className="border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white transition-all transform hover:scale-105"
//             >
//               <div className="relative">
//                 {restaurant.image && (
//                   <a href={`http://localhost:5000${restaurant.menu}`} target="_blank" rel="noopener noreferrer">
//                     <img
//                       src={`http://localhost:5000${restaurant.image}`}
//                       alt={restaurant.name}
//                       className="w-full h-64 object-cover"
//                     />
//                   </a>
//                 )}
//                 <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 flex justify-center items-center">
//                   <p className="text-white text-2xl font-bold">{restaurant.name}</p>
//                 </div>
//               </div>
//               <div className="p-4">
//                 <p className="text-gray-700">{restaurant.address}</p>
//                 <p className="text-gray-500">{restaurant.cuisine}</p>
//                 <p className="text-gray-500">{restaurant.contact}</p>
//                 {restaurant.menu && (
//                   <a
//                     href={`http://localhost:5000${restaurant.menu}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="mt-4 inline-block text-blue-600 hover:underline"
//                   >
//                     View Menu
//                   </a>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default RestaurantList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "./RestaurantCard";

function RestaurantList() {
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
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div className="p-4 text-center">Loading restaurants...</div>;
  }

  return (
    <div className="p-8 mt-10">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#502314] mt-20">Restaurants</h1>

      {restaurants.length === 0 ? (
        <p className="text-gray-500 text-center">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant._id}
              className="cursor-pointer"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <RestaurantCard 
                restaurant={restaurant}
                baseUrl={baseUrl}
              />
            </div>
          ))}
        </div>
      )}

      {selectedRestaurant && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#502314] mb-4">
              {selectedRestaurant.name} - Menu
            </h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Menu Items</h3>
              {selectedRestaurant.menuItems.length === 0 ? (
                <p className="text-gray-500">No menu items available</p>
              ) : (
                <div className="space-y-3">
                  {selectedRestaurant.menuItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">${item.price}</p>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
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
                className="border p-2 rounded w-full mb-3"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              
              <h3 className="font-medium mb-2">Your Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500 mb-3">No items in cart</p>
              ) : (
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border-b">
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-500">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="font-bold mt-2">
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