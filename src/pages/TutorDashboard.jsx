import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { motion } from "framer-motion";
import DashboardHome from "../components/TutorDashboard/DashboardHome";
import TutorServiceManagementPage from "./TutorDashboard/TutorServiceManagementPage";
import TutorBookingsPage from "./TutorDashboard/TutorBookingsPage";
import Earnings from "../components/TutorDashboard/Earnings";
import {
  FaHome,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

function TutorDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { path: "", name: "Dashboard", icon: <FaHome /> },
    { path: "services", name: "My Services", icon: <FaChalkboardTeacher /> },
    { path: "bookings", name: "Bookings", icon: <FaCalendarAlt /> },
    { path: "earnings", name: "Earnings", icon: <FaMoneyBillWave /> },
  ];

  // Determine the base path for relative links
  const baseDashboardPath = "/tutor-dashboard";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Hamburger button for mobile - modern, lower, animated, with dashboard label */}
      <motion.button
        initial={{ y: -30, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="fixed top-24 left-4 z-50 lg:hidden bg-gray-800 text-white p-1.5 rounded-md shadow-lg focus:outline-none flex items-center gap-1 border border-blue-400/40 hover:bg-gray-700 cursor-pointer"
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
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 p-6 shadow-lg z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex lg:translate-x-0 mt-16 lg:mt-0 pt-20`}
        style={{ minWidth: 256 }}
      >
        <div className="text-2xl font-bold mb-8 flex justify-between items-center">
          <span>📚 Tutor Panel</span>
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
        <nav>
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.name} className="mb-3">
                <Link
                  to={`${baseDashboardPath}/${link.path}`.replace(/\/$/, "")}
                  className={`flex items-center p-3 rounded-lg transition-colors
                    ${
                      location.pathname ===
                        `${baseDashboardPath}/${link.path}`.replace(
                          /\/$/,
                          ""
                        ) ||
                      (link.path === "" &&
                        location.pathname === baseDashboardPath)
                        ? "bg-blue-500 text-white shadow-md"
                        : "hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>{" "}
                  <span className="font-medium ml-2">{link.name}</span>{" "}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
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
      <main className="flex-1 ml-0 lg:ml-64 p-8 pt-24 mt-0 lg:mt-0 transition-all duration-300">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="services" element={<TutorServiceManagementPage />} />
            <Route path="bookings" element={<TutorBookingsPage />} />
            <Route path="earnings" element={<Earnings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default TutorDashboard;
