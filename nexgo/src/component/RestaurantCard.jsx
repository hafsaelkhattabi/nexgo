import React, { useState } from 'react';
import { ExternalLink, MapPin, Clock, Utensils } from 'lucide-react';

const RestaurantCard = ({ restaurant, baseUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [menuHovered, setMenuHovered] = useState(false);
  
  const imageUrl = restaurant.image ? `${baseUrl}${restaurant.image}` : '/placeholder.svg';
  const menuUrl = restaurant.menu ? `${baseUrl}${restaurant.menu}` : '';
  const isPdfMenu = menuUrl.endsWith('.pdf');
  
  // Parse tags or create from cuisine
  const tags = restaurant.tags || [restaurant.cuisine];

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
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Utensils size={16} />
            <span className="text-sm">{restaurant.cuisine}</span>
          </div>
          
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
  );
};

export default RestaurantCard;