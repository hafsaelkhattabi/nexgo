import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getOrders,
  createOrder,
  acceptOrder,
  assignOrder,
  completeOrder,
  initializeMockData
} from '../services/orderService';


const getRestaurants = () => {
  const data = localStorage.getItem('restaurants');
  return data ? JSON.parse(data) : [];
};

const getDeliveryPeople = () => {
  const data = localStorage.getItem('delivery_people');
  return data ? JSON.parse(data) : [];
};

const getMenuItems = (restaurantId) => {
  const defaultItems = [
    { id: `${restaurantId}-item1`, name: 'Burger', price: 8.99, restaurantId },
    { id: `${restaurantId}-item2`, name: 'Fries', price: 3.99, restaurantId },
    { id: `${restaurantId}-item3`, name: 'Drink', price: 2.99, restaurantId }
  ];

  if (restaurantId === 'rest2') {
    return [
      { id: `${restaurantId}-item1`, name: 'Margherita Pizza', price: 12.99, restaurantId },
      { id: `${restaurantId}-item2`, name: 'Pepperoni Pizza', price: 14.99, restaurantId },
      { id: `${restaurantId}-item3`, name: 'Garlic Bread', price: 4.99, restaurantId }
    ];
  }

  if (restaurantId === 'rest3') {
    return [
      { id: `${restaurantId}-item1`, name: 'California Roll', price: 9.99, restaurantId },
      { id: `${restaurantId}-item2`, name: 'Sashimi Set', price: 18.99, restaurantId },
      { id: `${restaurantId}-item3`, name: 'Miso Soup', price: 3.99, restaurantId }
    ];
  }

  return defaultItems;
};

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants] = useState(getRestaurants());
  const [deliveryPeople] = useState(getDeliveryPeople());

  useEffect(() => {
    initializeMockData();
    refreshOrders();
  }, []);

  const refreshOrders = () => {
    setLoading(true);
    try {
      const fetchedOrders = getOrders();
      const ordersWithDates = fetchedOrders.map(order => ({
        ...order,
        placedAt: new Date(order.placedAt),
        acceptedAt: order.acceptedAt ? new Date(order.acceptedAt) : undefined,
        assignedAt: order.assignedAt ? new Date(order.assignedAt) : undefined,
        completedAt: order.completedAt ? new Date(order.completedAt) : undefined
      }));
      setOrders(ordersWithDates);
    } catch (err) {
      console.error('Error loading orders', err);
      toast({ title: 'Error', description: 'Failed to load orders', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getRestaurantMenuItems = (restaurantId) => {
    return getMenuItems(restaurantId);
  };

  const createNewOrder = (orderData) => {
    try {
      const newOrder = createOrder(orderData);
      setOrders(prev => [...prev, newOrder]);
      toast({ title: 'Success', description: 'Order placed successfully!' });
      return newOrder;
    } catch (err) {
      console.error('Error creating order', err);
      toast({ title: 'Error', description: 'Failed to place order', variant: 'destructive' });
      return null;
    }
  };

  const acceptOrderById = (orderId, restaurantId) => {
    try {
      const updated = acceptOrder(orderId, restaurantId);
      if (updated) {
        refreshOrders();
        toast({ title: 'Order accepted' });
      } else {
        toast({ title: 'Error', description: 'Failed to accept order', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Error accepting order', err);
      toast({ title: 'Error', description: 'Failed to accept order', variant: 'destructive' });
    }
  };

  const assignOrderById = (orderId, deliveryPersonId) => {
    try {
      const updated = assignOrder(orderId, deliveryPersonId);
      if (updated) {
        refreshOrders();
        toast({ title: 'Order assigned' });
      } else {
        toast({ title: 'Error', description: 'Failed to assign order', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Error assigning order', err);
      toast({ title: 'Error', description: 'Failed to assign order', variant: 'destructive' });
    }
  };

  const completeOrderById = (orderId, deliveryPersonId) => {
    try {
      const updated = completeOrder(orderId, deliveryPersonId);
      if (updated) {
        refreshOrders();
        toast({ title: 'Order completed' });
      } else {
        toast({ title: 'Error', description: 'Failed to complete order', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Error completing order', err);
      toast({ title: 'Error', description: 'Failed to complete order', variant: 'destructive' });
    }
  };

  return (
    <DataContext.Provider value={{
      orders,
      loading,
      createNewOrder,
      acceptOrderById,
      assignOrderById,
      completeOrderById,
      refreshOrders,
      restaurants,
      getRestaurantMenuItems,
      deliveryPeople
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside a DataProvider");
  return context;
};
