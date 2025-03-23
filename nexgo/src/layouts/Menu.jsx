import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

const categories = ["Main", "Side", "Drink", "Dessert"];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Main",
  });

  useEffect(() => {
    // Fetch menu items from the database
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("/api/menu"); // Replace with your API endpoint
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleAddOrUpdateItem = async () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/menu/${editing}` : "/api/menu";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();

      if (editing) {
        setMenuItems(
          menuItems.map((item) =>
            item.id === editing ? { ...item, ...newItem } : item
          )
        );
      } else {
        setMenuItems([...menuItems, data]);
      }

      setEditing(null);
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "Main",
      });
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleEditItem = (id) => {
    const item = menuItems.find((item) => item.id === id);
    if (item) {
      setNewItem({ ...item });
      setEditing(id);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });
      setMenuItems(menuItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Menu Management</h1>
        <button
          onClick={() => {
            setEditing(null);
            setNewItem({
              name: "",
              description: "",
              price: 0,
              category: "Main",
            });
          }}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Item
        </button>
      </div>

      {/* Add/Edit Menu Item Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-6 py-4">
          <h3 className="text-lg font-medium">
            {editing ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
        </div>
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newItem.price || ""}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: parseFloat(e.target.value) })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <input
                placeholder="Item description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end sm:col-span-2">
              <button
                onClick={handleAddOrUpdateItem}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              >
                {editing ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all hover:shadow-xl"
          >
            <div className="p-6">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="flex items-center gap-1 bg-gray-200 px-4 py-1 rounded-lg hover:bg-gray-300 transition-all"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="flex items-center gap-1 bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;