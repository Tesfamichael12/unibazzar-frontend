import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaCog,
  FaServicestack,
} from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { motion } from "framer-motion";

const navItems = [
  { to: "/student-dashboard", label: "Dashboard", icon: <FaHome /> },
  {
    to: "/student-dashboard/my-listings",
    label: "My Listings",
    icon: <FaBoxOpen />,
  },
  {
    to: "/student-dashboard/add-listing",
    label: "Add Listing",
    icon: <FaPlus />,
  },
  {
    to: "/student-dashboard/my-services",
    label: "My Services",
    icon: <FaServicestack />,
  },
  {
    to: "/student-dashboard/add-service",
    label: "Add Service",
    icon: <FaPlus />,
  },
  { to: "/student-dashboard/settings", label: "Settings", icon: <FaCog /> },
];

export default function StudentDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="mt-16 min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      {/* Hamburger button for dashboard sidebar (lower, modern, animated, with label) */}
      <motion.button
        initial={{ y: -30, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="fixed top-24 left-4 z-50 lg:hidden bg-gray-900 text-white p-1.5 rounded-md shadow-lg focus:outline-none flex items-center gap-1 border border-blue-400/40 hover:bg-gray-800 cursor-pointer"
        style={{ fontSize: 18 }}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Open dashboard sidebar menu"
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: sidebarOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <HiOutlineSquares2X2 className="text-lg text-blue-400" />
        </motion.span>
        <span className="text-[10px] font-semibold tracking-wide uppercase text-blue-300 ml-1">
          Dashboard
        </span>
        <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-900/60 text-[9px] text-blue-200 font-bold border border-blue-400/30">
          SIDEBAR
        </span>
      </motion.button>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className={`w-64 bg-white dark:bg-gray-900 shadow-xl flex flex-col py-8 px-4 border-r border-gray-200 dark:border-gray-800 fixed top-0 left-0 h-screen z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex lg:translate-x-0 mt-16 lg:mt-0 pt-20`}
        style={{ minWidth: 256 }}
      >
        <div className="mb-10 text-2xl font-bold text-blue-700 dark:text-blue-300 text-center flex justify-between items-center">
          <span>UniBazzar</span>
          {/* Close button for mobile */}
          <button
            className="lg:hidden text-gray-400 hover:text-gray-700 p-1 ml-2 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 ${
                  isActive
                    ? "bg-blue-600 text-white dark:bg-blue-700"
                    : "text-gray-700 dark:text-gray-200"
                }`
              }
              style={{ cursor: "pointer" }}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></motion.div>
      )}
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 p-8 overflow-y-auto"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
