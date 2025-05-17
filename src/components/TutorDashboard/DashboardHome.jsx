import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Calendar, DollarSign } from "lucide-react";

const sessionData = [
  { month: "Jan", sessions: 12 },
  { month: "Feb", sessions: 9 },
  { month: "Mar", sessions: 14 },
  { month: "Apr", sessions: 13 },
  { month: "May", sessions: 17 },
  { month: "Jun", sessions: 15 },
];

const subjectData = [
  { name: "Math", value: 30 },
  { name: "Programming", value: 25 },
  { name: "Languages", value: 20 },
  { name: "Science", value: 15 },
];

const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171"];

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6 text-white">
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-full overflow-x-auto">
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <Calendar className="text-green-400" />
              <p className="text-sm pt-2">Total Sessions</p>
              <p className="text-xl font-bold">64</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <Users className="text-blue-400" />
              <p className="text-sm pt-2">Total Students</p>
              <p className="text-xl font-bold">28</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <div className="flex justify-between items-center">
            <div>
              <DollarSign className="text-yellow-400" />
              <p className="text-sm pt-2">Earnings</p>
              <p className="text-xl font-bold">1,320 ETB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-lg mb-2">Session Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sessionData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#34d399"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-lg mb-2">Subjects Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={subjectData}
                dataKey="value"
                nameKey="name"
                outerRadius={70}
                label
              >
                {subjectData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Color Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            {subjectData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-lg mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto rounded-lg shadow mb-6 w-full max-w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Student
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Subject
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Date
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Time
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                <td className="px-4 py-2 whitespace-nowrap">Sara Meles</td>
                <td className="px-4 py-2 whitespace-nowrap">Programming</td>
                <td className="px-4 py-2 whitespace-nowrap">2025-05-02</td>
                <td className="px-4 py-2 whitespace-nowrap">10:00 AM</td>
                <td className="px-4 py-2 whitespace-nowrap text-green-400">
                  Confirmed
                </td>
              </tr>
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                <td className="px-4 py-2 whitespace-nowrap">Jonas Alemu</td>
                <td className="px-4 py-2 whitespace-nowrap">Math</td>
                <td className="px-4 py-2 whitespace-nowrap">2025-05-01</td>
                <td className="px-4 py-2 whitespace-nowrap">2:00 PM</td>
                <td className="px-4 py-2 whitespace-nowrap text-yellow-400">
                  Pending
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
