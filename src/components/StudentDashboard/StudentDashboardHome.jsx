import { motion } from "framer-motion";

export default function StudentDashboardHome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto text-center"
    >
      <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-200">
        Welcome to Your Student Dashboard
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Here you can manage your products, services, and account settings. Use
        the sidebar to navigate.
      </p>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">My Listings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your used products.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">My Services</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your offered services.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
