import React from "react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center p-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          Student Dashboard
        </h1>
        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
          Welcome to your dashboard! Here you can view your activity, manage
          your listings, and see your recent orders and favorites.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              My Listings
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              0
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              My Orders
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              0
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Favorites
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              0
            </span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
              Messages
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
