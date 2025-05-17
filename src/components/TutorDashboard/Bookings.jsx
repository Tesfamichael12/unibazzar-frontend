import React from "react";

const bookings = [
  {
    id: 1,
    student: "Sara Meles",
    subject: "Math",
    date: "2025-05-04",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 2,
    student: "Jonas Alemu",
    subject: "Python Programming",
    date: "2025-05-05",
    time: "2:00 PM",
    status: "Confirmed",
  },
  {
    id: 3,
    student: "Abel T.",
    subject: "Math",
    date: "2025-05-10",
    time: "9:00 AM",
    status: "Confirmed",
  },
  {
    id: 4,
    student: "Sara M.",
    subject: "English",
    date: "2025-05-12",
    time: "11:00 AM",
    status: "Pending",
  },
  {
    id: 5,
    student: "Liya K.",
    subject: "Programming",
    date: "2025-05-13",
    time: "1:00 PM",
    status: "Completed",
  },
  {
    id: 6,
    student: "Miki B.",
    subject: "Science",
    date: "2025-05-14",
    time: "3:00 PM",
    status: "Cancelled",
  },
  {
    id: 7,
    student: "Robel S.",
    subject: "Math",
    date: "2025-05-15",
    time: "4:00 PM",
    status: "Confirmed",
  },
];

export default function Bookings() {
  const columns = ["Student", "Subject", "Date", "Time", "Status"];

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
        Bookings
      </h2>

      {/* Responsive bookings table */}
      <div className="overflow-x-auto rounded-lg shadow mb-8 w-full max-w-full">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {bookings.map((row, idx) => (
              <tr
                key={row.id}
                className="hover:bg-blue-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {row.student}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {row.subject}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {row.date}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {row.time}
                </td>
                <td className="px-4 py-2 text-gray-900 dark:text-white">
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
