// utils/customer.js
export const getOrCreateCustomer = () => {
    let customerId = localStorage.getItem("customerId");
  
    if (!customerId) {
      // Simulate a new customer ID (in real apps you'd get this from MongoDB after registration/login)
      customerId = crypto.randomUUID(); // or generate a mock MongoDB ObjectId if needed
      localStorage.setItem("customerId", customerId);
    }
  
    return customerId;
  };
  