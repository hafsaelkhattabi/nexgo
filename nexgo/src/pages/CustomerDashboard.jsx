import React, { useState } from 'react';
import { ShoppingCart, Utensils, Plus, Minus, Trash2 } from 'lucide-react';

// Utility function for class concatenation
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Mock menu items data
const menuItems = [
  { id: 1, name: 'Whopper Meal', price: 8.99, restaurant: 'Burger King' },
  { id: 2, name: 'Pepperoni Pizza', price: 12.99, restaurant: 'Pizza Hut' },
  { id: 3, name: 'Sushi Combo', price: 15.99, restaurant: 'Sushi Palace' },
  { id: 4, name: 'Chicken Tacos', price: 9.99, restaurant: 'Taco Bell' },
];

const CustomerDashboard = () => {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Increase item quantity
  const increaseQuantity = (itemId) => {
    setCart(
      cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (itemId) => {
    setCart(
      cart.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Customer Dashboard</h1>

        {/* Menu Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{item.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{item.restaurant}</p>
              <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Shopping Cart Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Shopping Cart
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.restaurant}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-all"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-red-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4">
                <h3 className="text-xl font-semibold text-gray-900">Total</h3>
                <p className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={() => alert('Order placed successfully!')}
                className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all mt-6"
              >
                Place Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;