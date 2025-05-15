import {
  FaChartBar,
  FaUser,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaTasks,
} from "react-icons/fa"; // Added FaTasks
import { Link } from "react-router-dom"; // Import Link

const Sidebar = ({ userRole }) => {
  // Added userRole prop
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-gray-700">
        🛒 UniBazzar
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <SidebarItem
            icon={<FaChartBar />}
            label="Dashboard"
            to="/dashboard"
          />{" "}
          {/* Assuming /dashboard is the main dashboard link */}
          {/* Conditional link for Merchants */}
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
          {/* Links for Admin (or other roles if applicable) - adjust as needed */}
          {(userRole === "admin" || userRole === "campus_admin") && (
            <>
              <SidebarItem
                icon={<FaBoxOpen />}
                label="Listings"
                to="/admin/listings"
              />{" "}
              {/* Example admin link */}
              <SidebarItem
                icon={<FaUser />}
                label="Users"
                to="/admin/users"
              />{" "}
              {/* Example admin link */}
              <SidebarItem
                icon={<FaMoneyCheckAlt />}
                label="Transactions"
                to="/admin/transactions"
              />{" "}
              {/* Example admin link */}
            </>
          )}
          {/* Add other role-specific or common links here */}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        &copy; 2025 UniBazzar
      </div>
    </aside>
  );
};

const SidebarItem = (
  { icon, label, to } // Added 'to' prop
) => (
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
