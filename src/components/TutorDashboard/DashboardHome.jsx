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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2">Student</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-2">Sara Meles</td>
                <td>Programming</td>
                <td>2025-05-02</td>
                <td>10:00 AM</td>
                <td className="text-green-400">Confirmed</td>
              </tr>
              <tr>
                <td className="py-2">Jonas Alemu</td>
                <td>Math</td>
                <td>2025-05-01</td>
                <td>2:00 PM</td>
                <td className="text-yellow-400">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
