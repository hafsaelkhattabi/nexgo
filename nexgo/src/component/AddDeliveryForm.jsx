import React, { useState } from "react";
import axios from "axios";

const AddDeliveryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/deliveries", formData);
      alert(response.data.message);
      setFormData({ name: "", email: "", phone: "", address: "" }); // Reset form
    } catch (error) {
      console.error(error);
      alert("Error adding delivery. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 mt-36">Add Delivery</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#FFC72C] text-[#502314] py-2 px-4 rounded-full font-bold hover:bg-[#502314] hover:text-white"
        >
          Add Delivery
        </button>
      </form>
    </div>
  );
};

export default AddDeliveryForm;