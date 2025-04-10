import React from "react";
import { Clock, User } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
};

const OrderCard = ({ order, onStatusChange }) => {
  const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(order.id, newStatus);
    }
  };

  const getNextStatus = () => {
    switch (order.status) {
      case "pending":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <div className="mb-4 overflow-hidden transition-all duration-300 hover:shadow-md animate-slideIn border border-gray-200 rounded-lg">
      <div className="bg-muted/30 pb-3 pt-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Order #{order.id.slice(-4)}</span>
            <span className={`px-3 py-1 text-xs rounded-full ${statusColors[order.status]}`}>
              {statusText}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>{order.customer}</span>
        </div>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{item.quantity}x</span>
                <span>{item.name}</span>
              </div>
              <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border/60 pt-2">
          <span className="font-medium">Total</span>
          <span className="font-medium">${order.total.toFixed(2)}</span>
        </div>
      </div>
      {order.status !== "completed" && (
        <div className="bg-muted/20 p-3">
          <button
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => nextStatus && handleStatusChange(nextStatus)}
          >
            Mark as {nextStatus?.charAt(0).toUpperCase() + nextStatus?.slice(1)}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

  