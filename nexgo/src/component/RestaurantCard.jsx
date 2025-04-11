
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Utensils, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const RestaurantCard = ({ restaurant, baseUrl, onAddToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const imageUrl = restaurant.image ? `${baseUrl}${restaurant.image}` : '/placeholder.svg';
  const tags = restaurant.tags || [restaurant.cuisine];

  const fetchMenuItems = async () => {
    if (!restaurant._id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${baseUrl}/menu/${restaurant._id}`);
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
      setError("Failed to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      fetchMenuItems();
    }
  }, [showMenu]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img 
          src={imageUrl}
          alt={restaurant.name}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        
        {/* Tags */}
        <div className="absolute top-3 right-3 flex gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-white/80 backdrop-blur-sm text-xs font-medium text-gray-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      

      {/* Restaurant Info */}
      <div className="p-4 flex-1 flex flex-col">

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">{restaurant.name}</h2>
          {restaurant.rating && (
            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-md">
              <span className="text-sm font-bold">{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{restaurant.address}</p>
          </div>
          
          {restaurant.deliveryTime && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} className="flex-shrink-0" />
              <p className="text-sm">{restaurant.deliveryTime} min</p>
            </div>
          )}
        </div>
        

        {/* Menu Toggle */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-auto">

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Utensils size={16} />
            <span className="text-sm">{restaurant.cuisine}</span>
          </div>
          

          <button 
            onClick={toggleMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600"
          >
            {showMenu ? (
              <>
                Hide Menu <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show Menu <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

        {/* Menu Items Section */}
        {showMenu && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-medium mb-3 text-lg">Menu</h3>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center py-4">{error}</p>
            ) : menuItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No menu items available</p>
            ) : (
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item._id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {item.image && (
                      <img 
                        src={item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}`} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <span className="font-bold text-orange-600">${item.price.toFixed(2)}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="mt-2 flex items-center gap-1 text-sm bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition-colors"
                      >
                        <Plus size={14} /> Add to order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

          {menuUrl && (
            <div 
              className="relative"
              onMouseEnter={() => setMenuHovered(true)}
              onMouseLeave={() => setMenuHovered(false)}
            >
              <a 
                href={menuUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 bg-orange-500 text-white hover:bg-orange-600"
              >
                Menu
                <ExternalLink size={14} className={`transition-transform duration-300 ${
                  menuHovered ? "translate-x-0.5" : ""
                }`} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default RestaurantCard;