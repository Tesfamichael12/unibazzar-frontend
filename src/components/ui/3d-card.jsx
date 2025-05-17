import { motion } from "framer-motion";
import React from "react";

export function CardContainer({ children, className = "" }) {
  // Subtle modern animation: scale and shadow only
  return (
    <motion.div
      className={`relative w-full max-w-sm mx-auto cursor-pointer group ${className}`}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{
        scale: 1.025,
        boxShadow:
          "0 8px 32px 0 rgba(34, 141, 212, 0.2), 0 2px 8px 0 rgba(0,0,0,0.08)",
        filter: "brightness(1.03)",
      }}
      style={{
        willChange: "transform, box-shadow, filter",
        transition: "box-shadow 0.3s, filter 0.3s",
      }}
    >
      {children}
    </motion.div>
  );
}

export function CardBody({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-visible p-6 relative transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardItem({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}
