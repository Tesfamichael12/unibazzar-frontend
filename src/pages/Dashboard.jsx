import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import StatCard from "../components/admin/StatCard";
import RevenueChart from "../components/admin/RevenueChart";
import SalesByCategoryChart from "../components/admin/SalesByCategoryChart";
import AccountTable from "../components/admin/AccountTable";
import { FaDollarSign, FaUsers, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux"; // Import useSelector

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <Sidebar userRole={user?.role} /> {/* Pass user's role to Sidebar */}
      {/* Main Content with margin-left to avoid overlapping sidebar */}
      <div className="flex-1 ml-64 p-6 bg-gray-900 text-white min-h-screen">
        <Header />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Income"
            value="78.8k ETB"
            icon={<FaDollarSign />}
            trend="up"
          />
          <StatCard title="New Users" value="2,150" icon={<FaUsers />} />
          <StatCard
            title="Orders"
            value="1,784"
            icon={<FaShoppingCart />}
            trend="down"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <SalesByCategoryChart />
        </div>

        {/* Table */}
        <AccountTable />
      </div>
    </div>
  );
};

export default Dashboard;
