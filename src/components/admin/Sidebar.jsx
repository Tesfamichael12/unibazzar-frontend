import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChartBar,
  FaUser,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaTasks,
} from "react-icons/fa";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Hamburger button for dashboard sidebar (lower, smaller, modern icon, animated, with label) */}
      <motion.button
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="fixed top-20 left-4 z-50 lg:hidden bg-gray-900 text-white p-1.5 rounded-md shadow-lg focus:outline-none flex items-center gap-1 border border-blue-400/40 hover:bg-gray-800"
        style={{ fontSize: 20 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open dashboard sidebar menu"
      >
        <HiMiniSquares2X2 className="text-xl text-blue-400" />
        <span className="text-xs font-semibold tracking-wide uppercase text-blue-300">
          Dashboard
        </span>
      </motion.button>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex lg:translate-x-0`}
        style={{ minWidth: 256 }}
      >
        <div className="text-2xl font-bold p-6 border-b border-gray-700 flex justify-between items-center">
          <span>🛒 UniBazzar</span>
          {/* Close button for mobile */}
          <button
            className="lg:hidden text-gray-400 hover:text-white p-1 ml-2"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
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
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <SidebarItem
              icon={<FaChartBar />}
              label="Dashboard"
              to="/dashboard"
            />
            {userRole === "merchant" && (
              <>
                <SidebarItem
                  icon={<FaTasks />}
                  label="Manage Products"
                  to="/merchant/products"
                />
                <SidebarItem
                  icon={<FaMoneyCheckAlt />}
                  label="Earnings"
                  to="/merchant/earnings"
                />
              </>
            )}
            {(userRole === "admin" || userRole === "campus_admin") && (
              <>
                <SidebarItem
                  icon={<FaBoxOpen />}
                  label="Listings"
                  to="/admin/listings"
                />
                <SidebarItem
                  icon={<FaUser />}
                  label="Users"
                  to="/admin/users"
                />
                <SidebarItem
                  icon={<FaMoneyCheckAlt />}
                  label="Transactions"
                  to="/admin/transactions"
                />
              </>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          &copy; 2025 UniBazzar
        </div>
      </motion.aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        ></motion.div>
      )}
    </>
  );
};

const SidebarItem = ({ icon, label, to }) => (
  <li>
    <Link
      to={to}
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  </li>
);

export default Sidebar;
