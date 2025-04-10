import React, { useEffect, useState } from "react";
import axios from "axios";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  // Fetch deliveries from backend
  const fetchDeliveries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/deliveries");
      setDeliveries(response.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Deliveries</h2>

      {deliveries.length === 0 ? (
        <p>No deliveries yet.</p>
      ) : (
        <ul className="space-y-2">
          {deliveries.map((delivery) => (
            <li key={delivery._id} className="p-3 bg-white shadow rounded">
              <strong>{delivery.name}</strong> - {delivery.address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Deliveries;
