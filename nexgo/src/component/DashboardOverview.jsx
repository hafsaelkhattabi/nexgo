import React, { useState, useEffect } from "react";
import { Store, Truck, BarChart2, DollarSign } from "lucide-react";
import { apiService } from "../services/ApiServices";

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-white/50 shadow-sm animate-pulse">
            <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Restaurant Count Card */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Total Restaurants</h3>
            <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-600">
              <Store className="h-full w-full" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.restaurantCount || 0}</div>
          <p className="text-xs text-gray-500">Active restaurant partners</p>
        </div>

        {/* Pending Deliveries Card */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Pending Deliveries</h3>
            <div className="h-8 w-8 rounded-full bg-yellow-100 p-1.5 text-yellow-600">
              <Truck className="h-full w-full" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.pendingDeliveries || 0}</div>
          <p className="text-xs text-gray-500">Orders in delivery process</p>
        </div>

        {/* Completed Deliveries Card */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Completed Deliveries</h3>
            <div className="h-8 w-8 rounded-full bg-green-100 p-1.5 text-green-600">
              <Truck className="h-full w-full" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.completedDeliveries || 0}</div>
          <p className="text-xs text-gray-500">Successfully delivered orders</p>
        </div>

        {/* Total Orders Card */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Total Orders</h3>
            <div className="h-8 w-8 rounded-full bg-purple-100 p-1.5 text-purple-600">
              <BarChart2 className="h-full w-full" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{stats?.totalOrders || 0}</div>
          <p className="text-xs text-gray-500">All time orders</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders Section */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-2">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.restaurantName}</p>
                  </div>
                  <div>
                    <p className="text-right font-medium">${order.totalAmount?.toFixed(2)}</p>
                    <p className="text-right text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent orders</p>
          )}
        </div>

        {/* Popular Restaurants Section */}
        <div className="rounded-lg border bg-white/50 shadow-sm p-4">
          <h3 className="text-lg font-medium mb-4">Popular Restaurants</h3>
          {stats?.popularRestaurants && stats.popularRestaurants.length > 0 ? (
            <div className="space-y-2">
              {stats.popularRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{restaurant.name}</p>
                    <p className="text-sm text-gray-500">{restaurant.cuisineType}</p>
                  </div>
                  <div>
                    <p className="text-right font-medium">{restaurant.totalOrders} orders</p>
                    <p className="text-right text-xs text-gray-500">
                      Rating: {restaurant.rating}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No restaurant data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
