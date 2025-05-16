import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaPlus,
  FaCog,
  FaServicestack,
} from "react-icons/fa";
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
  return (
    <div className="mt-16 min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-64 bg-white dark:bg-gray-900 shadow-xl flex flex-col py-8 px-4 border-r border-gray-200 dark:border-gray-800"
      >
        <div className="mb-10 text-2xl font-bold text-blue-700 dark:text-blue-300 text-center">
          UniBazzar
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
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
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
