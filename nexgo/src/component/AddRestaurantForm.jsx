import axios from "axios";
import React, { useState } from "react";

function AddRestaurantForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    contact: "",
    image: null,
    menu: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("address", formData.address);
    data.append("cuisine", formData.cuisine);
    data.append("contact", formData.contact);
    if (formData.image) data.append("image", formData.image);
    if (formData.menu) data.append("menu", formData.menu);

    try {
      const response = await axios.post("http://localhost:5000/image/restaurants", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Restaurant added successfully!");
        setFormData({ name: "", address: "", cuisine: "", contact: "", image: null, menu: null });
      } else {
        alert("Failed to add restaurant.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the restaurant.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 mt-36 text-[#502314]">Add Your Restaurant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Restaurant Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine Type"
          value={formData.cuisine}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Information"
          value={formData.contact}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept="image/*"
        />
        <input
          type="file"
          name="menu"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          accept="image/*, application/pdf"
        />
        <button
          type="submit"
          className="bg-[#FFC72C] text-[#502314] py-2 px-4 rounded-full font-bold hover:bg-[#502314] hover:text-white"
        >
          Add Reastaurant
        </button>
      </form>
    </div>
  );
}

export default AddRestaurantForm;