import React from 'react';

// Utility function for class concatenation
const cn = (...classes) => classes.filter(Boolean).join(' ');

const DashboardCard = ({ title, children, className, style }) => {
  return (
    <div 
      className={cn(
        'rounded-xl p-5 glassmorphism card-hover',
        className
      )}
      style={style}
    >
      <h3 className="text-lg font-medium text-gray-800 mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default DashboardCard;