import { Routes, Route, Link, useLocation } from "react-router-dom";
import DashboardHome from "../components/TutorDashboard/DashboardHome";
import MyTutoringServices from "../components/TutorDashboard/MyTutoringServices";
import Bookings from "../components/TutorDashboard/Bookings";
import Earnings from "../components/TutorDashboard/Earnings";
import {
  FaHome,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

function TutorDashboard() {
  const location = useLocation();

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
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 shadow-lg fixed h-full mt-16 lg:mt-0 pt-20 z-40">
        {" "}
        {/* Added pt-20 and z-40 for top padding and stacking */}
        <nav>
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.name} className="mb-3">
                <Link
                  to={`${baseDashboardPath}/${link.path}`.replace(/\/$/, "")} // Ensure no trailing slash for base path
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
                >
                  <span className="text-lg">{link.icon}</span>{" "}
                  {/* Removed margin class */}
                  <span className="font-medium ml-2">{link.name}</span>{" "}
                  {/* Added ml-2 to the text span for a small gap */}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 pt-24 mt-0 lg:mt-0">
        {" "}
        {/* Added pt-24 for top padding */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="services" element={<MyTutoringServices />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="earnings" element={<Earnings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default TutorDashboard;
