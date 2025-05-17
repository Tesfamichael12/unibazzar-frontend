import { motion } from "framer-motion";

export default function StudentSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">
        Account Settings
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Profile management coming soon.
        </p>
      </div>
    </motion.div>
  );
}
