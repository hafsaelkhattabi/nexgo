import React from 'react';
import PropTypes from 'prop-types';

const OrderComponent = ({ order }) => {
  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      {/* Add more JSX to display order details */}
    </div>
  );
};

OrderComponent.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    customerId: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    customerAddress: PropTypes.string.isRequired,
    customerPhone: PropTypes.string.isRequired,
    restaurantId: PropTypes.string.isRequired,
    restaurantName: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalAmount: PropTypes.number.isRequired,
    status: PropTypes.oneOf([
      'pending',
      'accepted_by_restaurant',
      'rejected_by_restaurant',
      'ready_for_delivery',
      'accepted_by_delivery',
      'in_delivery',
      'delivered',
      'cancelled'
    ]).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    acceptedByDeliveryId: PropTypes.string,
    deliveryName: PropTypes.string,
    estimatedDeliveryTime: PropTypes.string,
    statusUpdates: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        note: PropTypes.string,
      })
    ),
  }).isRequired
};

export default OrderComponent;