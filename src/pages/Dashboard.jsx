import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import StatCard from "../components/admin/StatCard";
import RevenueChart from "../components/admin/RevenueChart";
import SalesByCategoryChart from "../components/admin/SalesByCategoryChart";
import { FaDollarSign, FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <Sidebar userRole={user?.role} />
      {/* Main Content with margin-left to avoid overlapping sidebar */}
      <div className="flex-1 ml-64 p-6 bg-gray-900 text-white min-h-screen">
        <Header />

        {/* Stat Cards for Merchants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Total Sales"
            value="1,784"
            icon={<FaShoppingCart />}
            trend="up"
          />
          <StatCard
            title="Total Income"
            value="78.8k ETB"
            icon={<FaDollarSign />}
            trend="up"
          />
          <StatCard title="Active Products" value="120" icon={<FaBoxOpen />} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RevenueChart />
          <SalesByCategoryChart />
        </div>

        {/* Recent Orders Table Placeholder */}
        <div className="bg-gray-800 rounded-xl shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-white">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows, replace with real data */}
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4">#1001</td>
                  <td className="py-2 px-4">2025-05-15</td>
                  <td className="py-2 px-4">ETB 320.00</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-600 text-white">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4">#1000</td>
                  <td className="py-2 px-4">2025-05-14</td>
                  <td className="py-2 px-4">ETB 150.00</td>
                  <td className="py-2 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-500 text-black">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
