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
    <div className="flex min-h-screen text-gray-900 dark:text-gray-100">
      <motion.button
        initial={{ y: -30, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="fixed top-20 left-4 z-50 lg:hidden backdrop-blur-md bg-white/40 dark:bg-gray-900/40 border border-blue-400/30 dark:border-blue-400/40 shadow-lg focus:outline-none flex items-center gap-1 p-1.5 rounded-md cursor-pointer transition-colors"
        style={{ fontSize: 18, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)" }}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Open dashboard sidebar menu"
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: sidebarOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <HiOutlineSquares2X2 className="text-lg text-blue-500 dark:text-blue-300 transition-colors" />
        </motion.span>
        <span
          className="text-[10px] font-semibold tracking-wide uppercase ml-1 transition-colors"
          style={{ color: "#1e90ff", textShadow: "0 1px 2px rgba(0,0,0,0.18)" }}
        >
          Dashboard
        </span>
        <span
          className="ml-1 px-1.5 py-0.5 rounded bg-[#1e90ff]/80 dark:bg-[#1e90ff]/60 text-[9px] font-bold border border-blue-400/30 dark:border-blue-400/40 transition-colors shadow-sm"
          style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
        >
          SIDEBAR
        </span>
      </motion.button>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full lg:h-screen w-64 bg-white dark:bg-gray-800 shadow-lg z-40 transition-transform duration-300 lg:sticky lg:top-0 lg:self-start lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } mt-16 lg:mt-0 pt-40`}
        style={{ minWidth: 256, padding: 0 }}
      >
        <div className="flex flex-col h-full w-full">
          <div className="text-2xl font-bold mb-8 flex justify-between items-center px-6 pt-6">
            {/* Show only on small screens */}
            <span className="block lg:hidden pt-10">📚 Tutor Panel</span>
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
          <nav className="flex-1">
            <ul className="flex flex-col gap-1 px-2 pb-6 pt-5">
              {sidebarLinks.map((link) => (
                <li key={link.name} className="mb-1">
                  <Link
                    to={`${baseDashboardPath}/${link.path}`.replace(/\/$/, "")}
                    className={`flex items-center p-3 rounded-lg transition-colors w-full
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
        </div>
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
      <main className="flex-1 ml-0 p-2 pt-20 mt-0 transition-all duration-300 min-w-0 max-w-full overflow-x-auto">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl w-full max-w-full overflow-x-auto pt-[20px]">
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
