import React, { useEffect, useState } from "react";
import axios from "axios";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/restaurants")
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 mt-44">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants found.</p>
      ) : (
        <ul className="space-y-4">
          {restaurants.map((restaurant) => (
            <li key={restaurant._id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold">{restaurant.name}</h2>
              <p>{restaurant.address}</p>
              <p>{restaurant.cuisine}</p>
              <p>{restaurant.contact}</p>
              {restaurant.image && (
                <img src={`http://localhost:5000${restaurant.image}`} alt={restaurant.name} className="mt-2 w-32 h-32 object-cover" />
              )}
              {restaurant.menu && (
                restaurant.menu.endsWith(".pdf") ? (
                  <a href={`http://localhost:5000${restaurant.menu}`} target="_blank" rel="noopener noreferrer" className="mt-2 text-blue-500">
                    View Menu (PDF)
                  </a>
                ) : (
                  <img src={`http://localhost:5000${restaurant.menu}`} alt="Menu" className="mt-2 w-32 h-32 object-cover" />
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RestaurantList;
