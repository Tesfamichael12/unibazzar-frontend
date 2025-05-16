import React from "react";
import { FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import RevenueChart from "../admin/RevenueChart";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const earningsData = {
  totalEarnings: 2450.75,
  thisMonth: 320.5,
  pending: 120.0,
  transactions: [
    { id: 1, date: "2025-05-15", amount: 120.0, status: "Pending" },
    { id: 2, date: "2025-05-10", amount: 200.0, status: "Completed" },
    { id: 3, date: "2025-05-01", amount: 100.5, status: "Completed" },
    { id: 4, date: "2025-04-28", amount: 80.0, status: "Completed" },
  ],
  monthly: [
    { month: "Jan", amount: 200 },
    { month: "Feb", amount: 300 },
    { month: "Mar", amount: 400 },
    { month: "Apr", amount: 350 },
    { month: "May", amount: 320.5 },
  ],
};

const doughnutData = {
  labels: ["Completed", "Pending"],
  datasets: [
    {
      data: [
        earningsData.transactions
          .filter((t) => t.status === "Completed")
          .reduce((a, b) => a + b.amount, 0),
        earningsData.transactions
          .filter((t) => t.status === "Pending")
          .reduce((a, b) => a + b.amount, 0),
      ],
      backgroundColor: ["#22c55e", "#facc15"],
      borderWidth: 2,
    },
  ],
};

export default function Earnings() {
  return (
    <div className="space-y-8 p-4 md:p-8 mt-20">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-blue-600 rounded-xl p-6 flex items-center text-white shadow">
          <FaMoneyBillWave className="text-4xl mr-4" />
          <div>
            <div className="text-lg font-semibold">Total Earnings</div>
            <div className="text-2xl font-bold">
              ETB {earningsData.totalEarnings.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-green-600 rounded-xl p-6 flex items-center text-white shadow">
          <FaChartLine className="text-4xl mr-4" />
          <div>
            <div className="text-lg font-semibold">This Month</div>
            <div className="text-2xl font-bold">
              ETB {earningsData.thisMonth.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-yellow-500 rounded-xl p-6 flex items-center text-black shadow">
          <FaMoneyBillWave className="text-4xl mr-4" />
          <div>
            <div className="text-lg font-semibold">Pending</div>
            <div className="text-2xl font-bold">
              ETB {earningsData.pending.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Earnings Trend
        </h2>
        <RevenueChart />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-gray-100 dark:border-gray-700"
                >
                  <td className="py-2 px-4">{tx.date}</td>
                  <td className="py-2 px-4">ETB {tx.amount.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
