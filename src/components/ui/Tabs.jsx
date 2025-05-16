import React from "react";

export const Tabs = ({ children, value, onValueChange, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList = ({ children, value, onValueChange }) => {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

export const TabsTrigger = React.forwardRef(
  ({ children, value, onValueChange, currentValue }, ref) => {
    const isActive = currentValue === value;
    return (
      <button
        ref={ref}
        className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
          isActive
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        }`}
        onClick={() => onValueChange(value)}
      >
        {children}
      </button>
    );
  }
);
