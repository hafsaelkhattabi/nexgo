import React, { useState, useContext, useEffect } from "react";
import { Clock, MapPin, Loader, Navigation } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext"; 
import { LanguageContext } from "../context/LanguageContext";

const Hero = () => {
  const { darkMode } = useContext(ThemeContext);
  const { language, translations } = useContext(LanguageContext);
  const [location, setLocation] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    // Trigger entrance animations after component mounts
    setIsVisible(true);
    
    // Set up pulsing button animation
    const interval = setInterval(() => {
      setAnimateButton(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Get current user location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // For simplicity, we'll just store the coordinates
        // In a real app, you might want to use a geocoding service
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude}, ${longitude}`);
        setIsLocating(false);
      },
      (error) => {
        let errorMsg = "Failed to get your location";
        if (error.code === 1) {
          errorMsg = "Location access denied";
        } else if (error.code === 2) {
          errorMsg = "Position unavailable";
        } else if (error.code === 3) {
          errorMsg = "Location request timed out";
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    if (locationError) setLocationError("");
  };

  const handleChooseRestaurant = () => {
    if (!location.trim()) {
      setLocationError("Please enter a delivery location");
      return;
    }
    
    if (!deliveryTime) {
      alert("Please select a delivery time");
      return;
    }
    
    alert(`Location: ${location}, Delivery Time: ${deliveryTime}`);
    // Here you would typically navigate to restaurant selection page
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with zoom effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="public/burger.PNG" 
          alt="Burger background" 
          className="w-full h-full object-cover transform scale-105 transition-transform duration-10000 animate-slow-zoom"
        />
        {/* Animated overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'}`}></div>
      </div>
      
      {/* Hero content with staggered fade-in animations */}
      <div className={`relative z-10 text-center ${
          darkMode ? "text-white" : "text-yellow-400"
        } p-8 rounded-lg mx-4 max-w-2xl transition-all duration-1000 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 mt-20 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {translations[language]["heroTitle"]}
        </h1>
        
        <p className={`text-white mb-8 text-xl md:text-2xl transition-all duration-1000 delay-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {translations[language]["heroSubtitle"]}{" "}
          <span className="rounded bg-opacity-80 text-orange-500 font-bold animate-pulse">NOW</span> !!!
        </p>
        
        <div className={`transition-all duration-700 delay-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Location input - improved design */}
            <div className="relative flex-grow group">
              <div className={`flex items-center w-full overflow-hidden border-2 ${
                locationError ? "border-red-500" : 
                darkMode ? "border-gray-600 bg-gray-800" : "border-yellow-300 bg-white"
              } rounded-lg shadow-md transition-all duration-300 ${
                darkMode ? "focus-within:border-yellow-500" : "focus-within:border-yellow-500"
              } focus-within:shadow-lg hover:shadow-lg`}>
                <MapPin className={`ml-3 ${locationError ? "text-red-500" : "text-gray-400"}`} size={20} />
                <input
                  type="text"
                  placeholder={translations[language]["locationPlaceholder"] || "Enter delivery address"}
                  value={location}
                  onChange={handleLocationChange}
                  className={`p-4 pl-2 w-full focus:outline-none ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                  }`}
                />
                <button 
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className={`px-3 h-full flex items-center justify-center ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-yellow-50"
                  } transition-colors`}
                  title="Use current location"
                >
                  {isLocating ? (
                    <Loader className="animate-spin text-gray-400" size={20} />
                  ) : (
                    <Navigation className={`${locationError ? "text-red-500" : "text-gray-400 hover:text-yellow-500"}`} size={20} />
                  )}
                </button>
              </div>
              {locationError && (
                <p className="absolute left-0 text-red-500 text-sm mt-1">
                  {locationError}
                </p>
              )}
            </div>
            
            {/* Time input - matching design */}
            <div className="relative">
              <div className={`flex items-center overflow-hidden border-2 ${
                darkMode ? "border-gray-600 bg-gray-800" : "border-yellow-300 bg-white"
              } rounded-lg shadow-md transition-all duration-300 ${
                darkMode ? "focus-within:border-yellow-500" : "focus-within:border-yellow-500"
              } focus-within:shadow-lg hover:shadow-lg`}>
                <Clock className="ml-3 text-gray-400" size={20} />
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className={`p-4 pl-2 w-full focus:outline-none ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Button - enhanced design */}
          <button
            onClick={handleChooseRestaurant}
            className={`w-full md:w-auto mt-4 bg-yellow-400 text-yellow-900 p-4 px-8 rounded-lg font-bold 
              hover:bg-yellow-500 hover:shadow-lg active:bg-yellow-600 active:transform active:scale-95
              transition-all duration-300 ${
                animateButton ? 'shadow-lg scale-105' : 'shadow scale-100'
              }`}
          >
            {translations[language]["chooseRestaurantButton"] || "Find Restaurants"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add this to your global CSS or as a style tag in your component
const styles = `
@keyframes slowZoom {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}

.animate-slow-zoom {
  animation: slowZoom 20s ease-in-out infinite alternate;
}
`;

export default Hero;