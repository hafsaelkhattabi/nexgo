import React, { useState } from "react";
import Navbar from "../layouts/Navbar";
import Sidebar from "../layouts/Sidebar";

const StatCard = ({ title, value, icon, trend, subtitle }) => (
  <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            {trend && (
              <span className="flex items-center text-xs text-green-500">
                {trend} <span className="ml-0.5 text-green-500">↑</span>
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-200 text-primary-600">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

const RestaurantDashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [preparingOrders, setPreparingOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
          <p className="text-gray-500 mb-8">
            Overview of your restaurant's performance and orders
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Revenue"
              value="$1,248.56"
              icon={<span className="text-2xl">$</span>}
              trend="+12.5%"
              subtitle="Compared to last month"
            />
            <StatCard
              title="Orders Today"
              value="24"
              icon={<span className="text-2xl">🛍️</span>}
              trend="+8.2%"
            />
            <StatCard
              title="Active Orders"
              value={`${pendingOrders.length + preparingOrders.length + readyOrders.length}`}
              icon={<span className="text-2xl">📦</span>}
            />
            <StatCard
              title="Avg. Prep Time"
              value="18m"
              icon={<span className="text-2xl">⏰</span>}
              subtitle="Last 30 days"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4">
                <h2 className="text-xl">Revenue Overview</h2>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-200">Chart Goes Here</div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-4">
                <h2 className="text-xl">Orders Management</h2>
              </div>
              <div className="p-6">
                <div className="tabs">
                  <div className="tabs-header flex mb-4">
                    <button
                      className={`flex-1 p-2 ${activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      onClick={() => setActiveTab("pending")}
                    >
                      Pending ({pendingOrders.length})
                    </button>
                    <button
                      className={`flex-1 p-2 ${activeTab === "preparing" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      onClick={() => setActiveTab("preparing")}
                    >
                      Preparing ({preparingOrders.length})
                    </button>
                    <button
                      className={`flex-1 p-2 ${activeTab === "ready" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                      onClick={() => setActiveTab("ready")}
                    >
                      Ready ({readyOrders.length})
                    </button>
                  </div>

                  <div className="p-4">
                    {activeTab === "pending" && (
                      <div>
                        {pendingOrders.length === 0 ? (
                          <p className="text-center text-gray-500">No pending orders</p>
                        ) : (
                          <ul>
                            {pendingOrders.map((order) => (
                              <li key={order.id} className="border-b py-4">
                                <p className="font-semibold">{order.customer}</p>
                                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {activeTab === "preparing" && (
                      <div>
                        {preparingOrders.length === 0 ? (
                          <p className="text-center text-gray-500">No orders in preparation</p>
                        ) : (
                          <ul>
                            {preparingOrders.map((order) => (
                              <li key={order.id} className="border-b py-4">
                                <p className="font-semibold">{order.customer}</p>
                                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    {activeTab === "ready" && (
                      <div>
                        {readyOrders.length === 0 ? (
                          <p className="text-center text-gray-500">No orders ready for pickup</p>
                        ) : (
                          <ul>
                            {readyOrders.map((order) => (
                              <li key={order.id} className="border-b py-4">
                                <p className="font-semibold">{order.customer}</p>
                                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
