import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { 
  Search, 
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  Truck,
  Store
} from "lucide-react";
// import Navigation from "../components/Navigation";
// import RestaurantCard from "@/components/RestaurantCard";
// import { restaurants } from "@/utils/mockData";
import { useElementOnScreen, useAnimationSequence } from "../utils/Animations";

const dash = () => {
  const [scrollY, setScrollY] = useState(0);
  
  // Animation refs
  const { containerRef: heroRef, isVisible: heroVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });
  
  const { containerRef: featuresRef, isVisible: featuresVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });
  
  const { containerRef: restaurantsRef, isVisible: restaurantsVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });
  
  const { containerRef: ctaRef, isVisible: ctaVisible } = useElementOnScreen({
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  });
  
  // Sequence animations
  const featureItems = [1, 2, 3];
  const featureItemsVisible = useAnimationSequence(featureItems, 200, 200);
  
  const visibleRestaurants = restaurants.slice(0, 3);
  const restaurantItemsVisible = useAnimationSequence(visibleRestaurants, 200, 200);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation transparent />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/95 overflow-hidden"
      >
        <div 
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px)",
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div 
              className={`transition-all duration-1000 ease-out-expo ${
                heroVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Delicious food, delivered to your doorstep
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Order from your favorite restaurants and enjoy a seamless delivery experience with our premium service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-base">
                  <Link to="/customer">Order as Customer <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/restaurant">Manage Restaurant <Store className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/delivery">Deliver Orders <Truck className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Button 
            variant="ghost"
            className="animate-bounce rounded-full"
            onClick={() => window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth"
            })}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 bg-secondary/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-1000 ease-out-expo ${
              featuresVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              How It Works
            </h2>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto transition-all duration-1000 ease-out-expo ${
              featuresVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              Our platform connects customers, restaurants, and delivery personnel for a seamless experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`premium-card flex flex-col items-center text-center transition-all duration-1000 ease-out-expo ${
              featureItemsVisible[0] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Order Online</h3>
              <p className="text-muted-foreground">
                Browse restaurants, view menus, and place orders with just a few clicks.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link to="/customer">Order Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className={`premium-card flex flex-col items-center text-center transition-all duration-1000 ease-out-expo ${
              featureItemsVisible[1] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Restaurant Dashboard</h3>
              <p className="text-muted-foreground">
                Restaurants can manage menus, track orders, and update status in real-time.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link to="/restaurant">Restaurant Portal <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className={`premium-card flex flex-col items-center text-center transition-all duration-1000 ease-out-expo ${
              featureItemsVisible[2] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              <div className="bg-primary/10 rounded-full p-4 mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Delivery personnel use our app to efficiently pick up and deliver orders.
              </p>
              <Button asChild variant="link" className="mt-4">
                <Link to="/delivery">Delivery Portal <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Restaurants */}
      <section 
        ref={restaurantsRef}
        className="py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-1000 ease-out-expo ${
                restaurantsVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
              }`}>
                Featured Restaurants
              </h2>
              <p className={`text-xl text-muted-foreground max-w-2xl transition-all duration-1000 ease-out-expo ${
                restaurantsVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
              }`}>
                Discover top-rated restaurants in your area.
              </p>
            </div>
            <div className={`transition-all duration-1000 ease-out-expo ${
              restaurantsVisible ? "opacity-100 transform translate-x-0" : "opacity-0 transform translate-x-12"
            }`}>
              <Button asChild variant="outline">
                <Link to="/customer">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleRestaurants.map((restaurant, index) => (
              <div 
                key={restaurant.id} 
                className={`transition-all duration-1000 ease-out-expo ${
                  restaurantItemsVisible[index] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
                }`}
              >
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 bg-primary text-primary-foreground"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-1000 ease-out-expo ${
              ctaVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              Ready to get started?
            </h2>
            <p className={`text-xl opacity-90 mb-8 transition-all duration-1000 ease-out-expo ${
              ctaVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              Choose your role and start using our platform right away.
            </p>
            <div className={`transition-all duration-1000 ease-out-expo ${
              ctaVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-12"
            }`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="text-base">
                  <Link to="/customer">Order Food <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base bg-primary/20 text-primary-foreground hover:bg-primary/30">
                  <Link to="/restaurant">Restaurant Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base bg-primary/20 text-primary-foreground hover:bg-primary/30">
                  <Link to="/delivery">Delivery Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">FoodFast</h3>
              <p className="text-muted-foreground">
                Premium food delivery service connecting customers, restaurants, and delivery personnel.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link to="/customer" className="text-muted-foreground hover:text-foreground">Customer</Link></li>
                <li><Link to="/restaurant" className="text-muted-foreground hover:text-foreground">Restaurant</Link></li>
                <li><Link to="/delivery" className="text-muted-foreground hover:text-foreground">Delivery</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">For Businesses</h3>
              <ul className="space-y-2">
                <li><Link to="/restaurant" className="text-muted-foreground hover:text-foreground">Restaurant Dashboard</Link></li>
                <li><Link to="/delivery" className="text-muted-foreground hover:text-foreground">Delivery Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <address className="not-italic text-muted-foreground">
                <p>123 Delivery St</p>
                <p>Foodville, FL 12345</p>
                <p className="mt-2">contact@foodfast.com</p>
              </address>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} FoodFast. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default dash;