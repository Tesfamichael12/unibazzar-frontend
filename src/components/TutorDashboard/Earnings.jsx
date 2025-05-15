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
  { id: 1, subject: "Mathematics", date: "2025-04-01", amount: 500 },
  { id: 2, subject: "Python", date: "2025-04-03", amount: 650 },
  { id: 3, subject: "Math", date: "2025-04-06", amount: 500 },
  { id: 4, subject: "Data Structures", date: "2025-04-10", amount: 300 },
  { id: 5, subject: "Python", date: "2025-04-13", amount: 650 },
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
    (acc, session) => acc + session.amount,
    0
  );

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Earnings</h2>

      {/* Total Earnings */}
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-6">
        <p className="text-lg">Total Earnings:</p>
        <h3 className="text-3xl font-semibold text-green-400">
          {totalEarnings} ETB
        </h3>
      </div>

      {/* Earnings per Session */}
      <div className="bg-gray-800 p-4 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Sessions</h3>
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Date</th>
              <th>Subject</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sessionEarnings.map((session) => (
              <tr key={session.id} className="border-b border-gray-700">
                <td className="py-2">{session.date}</td>
                <td>{session.subject}</td>
                <td className="text-green-400">{session.amount} ETB</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Earnings Chart */}
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
