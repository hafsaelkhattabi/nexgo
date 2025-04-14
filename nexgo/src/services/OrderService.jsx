// Mock database using localStorage
const ORDERS_KEY = 'delivery_orders';

// Get all orders
export const getOrders = () => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

// Save orders
const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

// Create a new order
export const createOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'placed',
    placedAt: new Date()
  };

  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

// Update order status to accepted
export const acceptOrder = (orderId, restaurantId) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId && o.restaurantId === restaurantId);

  if (index === -1) return null;

  orders[index].status = 'accepted';
  orders[index].acceptedAt = new Date();
  saveOrders(orders);

  return orders[index];
};

// Assign order to delivery person
export const assignOrder = (orderId, deliveryPersonId) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId && o.status === 'accepted');

  if (index === -1) return null;

  orders[index].status = 'assigned';
  orders[index].assignedTo = deliveryPersonId;
  orders[index].assignedAt = new Date();
  saveOrders(orders);

  return orders[index];
};

// Complete an order
export const completeOrder = (orderId, deliveryPersonId) => {
  const orders = getOrders();
  const index = orders.findIndex(
    o => o.id === orderId && o.status === 'assigned' && o.assignedTo === deliveryPersonId
  );

  if (index === -1) return null;

  orders[index].status = 'completed';
  orders[index].completedAt = new Date();
  saveOrders(orders);

  return orders[index];
};

// Get orders for a restaurant
export const getRestaurantOrders = (restaurantId) => {
  return getOrders().filter(order => order.restaurantId === restaurantId);
};

// Get available orders for delivery people
export const getAvailableDeliveryOrders = () => {
  return getOrders().filter(order => order.status === 'accepted');
};

// Get assigned orders for a delivery person
export const getDeliveryPersonOrders = (deliveryPersonId) => {
  return getOrders().filter(
    order => order.status === 'assigned' && order.assignedTo === deliveryPersonId
  );
};

// Initialize with some mock data if empty
export const initializeMockData = () => {
  if (getOrders().length === 0) {
    // Add mock restaurants
    const restaurants = [
      { id: 'rest1', name: 'Burger Palace' },
      { id: 'rest2', name: 'Pizza Heaven' },
      { id: 'rest3', name: 'Sushi World' }
    ];
    localStorage.setItem('restaurants', JSON.stringify(restaurants));

    // Add mock delivery people
    const deliveryPeople = [
      { id: 'del1', name: 'John Doe' },
      { id: 'del2', name: 'Jane Smith' }
    ];
    localStorage.setItem('delivery_people', JSON.stringify(deliveryPeople));
  }
};
