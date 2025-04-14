import React from "react";
import { Clock, User, MapPin, ShoppingCart } from "lucide-react";

const OrderCard = ({ order, actions }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Clock className="text-gray-500 mr-2" size={18} />
          <span className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          #{order.orderNumber}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Order Items</h3>
        <ul className="space-y-2">
          {order.items.map((item, index) => (
            <li key={`${order._id}-item-${index}`} className="flex justify-between">
              <span>{item.name}</span>
              <span className="font-medium">
                {item.quantity} × ${item.price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-b border-gray-100 py-4 my-4">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-start">
          <User className="text-gray-500 mr-2 mt-1" size={18} />
          <div>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm text-gray-600">{order.customerPhone}</p>
          </div>
        </div>
        {order.deliveryAddress && (
          <div className="flex items-start">
            <MapPin className="text-gray-500 mr-2 mt-1" size={18} />
            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
          </div>
        )}
        {order.note && (
          <div className="flex items-start">
            <ShoppingCart className="text-gray-500 mr-2 mt-1" size={18} />
            <p className="text-sm text-gray-600">Note: {order.note}</p>
          </div>
        )}
      </div>

      {actions && (
        <div className="mt-4">
          {actions}
        </div>
      )}
    </div>
  );
};

export default OrderCard;