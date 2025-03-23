import React, { useState, useEffect } from 'react';
import { Package, Truck, Timer, ShoppingCart, MapPin, Clock, Utensils } from 'lucide-react';
import Navbar from '../layouts/Navbardelivery';

// Utility function for class concatenation
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Define the DashboardCard component
const DashboardCard = ({ title, className, style, children }) => (
  <div
    className={cn(
      'bg-white rounded-lg shadow-md p-6 transition-all duration-300',
      className
    )}
    style={style}
  >
    {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
    {children}
  </div>
);

// Define the MetricDisplay component
const MetricDisplay = ({ value, label, change, icon }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-gray-500">{label}</span>
    </div>
    <h3 className="text-2xl font-bold">{value}</h3>
    {change && (
      <span className="flex items-center text-xs text-green-500">
        {change}% <span className="ml-0.5 text-green-500">↑</span>
      </span>
    )}
  </div>
);

// Mock metrics data for demonstration
const metrics = [
  { label: 'Total Deliveries', value: 42, change: 18, icon: <Package className="w-5 h-5 text-primary" /> },
  { label: 'In Transit', value: 8, change: -5, icon: <Truck className="w-5 h-5 text-primary" /> },
  { label: 'On Time Rate', value: '96%', change: 3, icon: <Timer className="w-5 h-5 text-primary" /> },
  { label: 'New Orders', value: 16, change: 24, icon: <ShoppingCart className="w-5 h-5 text-primary" /> },
];

// Mock food delivery items data for demonstration
const mockDeliveryItems = [
  {
    id: '1',
    restaurant: 'Burger King',
    dish: 'Whopper Meal',
    address: '123 St, casablanca',
    status: 'Out for Delivery',
    estimatedDelivery: 'Today, 3:30 PM',
  },
  {
    id: '2',
    restaurant: 'Pizza Hut',
    dish: 'Pepperoni Pizza',
    address: '456 St,casablanac',
    status: 'In Transit',
    estimatedDelivery: 'Tomorrow, 10:00 AM',
  },
  {
    id: '3',
    restaurant: 'Sushi Palace',
    dish: 'Sushi Combo',
    address: '789  St, Casablanca',
    status: 'Processing',
    estimatedDelivery: 'May 12, 2023',
  },
];

const DeliveryDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Food Delivery Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your food delivery operations</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <DashboardCard 
              key={index} 
              title=""
              className={`transform transition-all duration-300 animate-fade-in opacity-0`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <MetricDisplay
                value={metric.value}
                label={metric.label}
                change={metric.change}
                icon={metric.icon}
              />
            </DashboardCard>
          ))}
        </div>

        {/* Delivery Items Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Food Delivery Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDeliveryItems.map((item) => (
              <DashboardCard key={item.id} title={`Order #${item.id}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium">{item.restaurant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-500">{item.dish}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-500">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-500">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-500">{item.estimatedDelivery}</span>
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>
        </div>

        {/* Performance Indicators */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <DashboardCard 
            title=""
            className="transform transition-all duration-300 animate-fade-in opacity-0"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Performance metrics visualization</p>
                <div className="flex space-x-2 justify-center">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    98.5% Delivered on time
                  </span>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    0.5% Return rate
                  </span>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;
