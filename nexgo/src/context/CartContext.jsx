import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the database
  useEffect(() => {
    axios
      .get("http://localhost:5000/customer/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Function to add a new order
  const addOrder = (newOrder) => {
    axios
      .post("http://localhost:5000/restaurants/orders", newOrder)
      .then((response) => {
        setOrders([...orders, response.data]); // Update state with new order
      })
      .catch((error) => console.error("Error placing order:", error));
  };

  return (
    <CartContext.Provider value={{ orders, addOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
