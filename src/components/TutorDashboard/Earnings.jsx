import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sessionEarnings = [
  { date: "2025-05-01", subject: "Math", amount: "200 ETB" },
  { date: "2025-05-02", subject: "Programming", amount: "300 ETB" },
  { date: "2025-05-03", subject: "Science", amount: "150 ETB" },
  { date: "2025-05-04", subject: "Math", amount: "250 ETB" },
  { date: "2025-05-05", subject: "English", amount: "180 ETB" },
];

const monthlySummary = [
  { month: "January", total: 0 },
  { month: "February", total: 0 },
  { month: "March", total: 10000 },
  { month: "April", total: 12000 },
  { month: "May", total: 8000 },
];

export default function Earnings() {
  const totalEarnings = sessionEarnings.reduce(
    (acc, session) => acc + parseInt(session.amount),
    0
  );

  const summary = [
    { label: "Total Earnings", value: `${totalEarnings} ETB` },
    { label: "Sessions This Month", value: "15" },
    { label: "Average Session", value: "800 ETB" },
    { label: "Top Subject", value: "Python" },
  ];

  const columns = ["date", "subject", "amount"];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
        Earnings
      </h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-6">
        <p className="text-lg">Total Earnings:</p>
        <h3 className="text-3xl font-semibold text-green-400">
          {totalEarnings} ETB
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-full overflow-x-auto">
        {summary.map((item) => (
          <div
            key={item.label}
            className="bg-green-50 dark:bg-gray-700 rounded-xl p-4 flex flex-col items-start shadow transition hover:shadow-lg min-w-0 w-full"
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-300 mb-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {item.value}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Sessions</h3>
        <div className="overflow-x-auto rounded-lg shadow mb-6 w-full max-w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {sessionEarnings.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-green-50 dark:hover:bg-gray-700 transition"
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className="px-4 py-2 text-gray-900 dark:text-white"
                    >
                      {row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">
          Monthly Earnings Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySummary}>
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="total" fill="#10B981" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
