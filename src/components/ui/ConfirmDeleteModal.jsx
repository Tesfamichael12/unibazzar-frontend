import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDeleteModal({
  isOpen,
  onCancel,
  onConfirm,
  itemName,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center"
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
          >
            <div className="text-3xl mb-2 text-red-600">⚠️</div>
            <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300 text-center">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{itemName}</span>?<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={onCancel}
                className="px-5 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold transition"
                style={{ cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow"
                style={{ cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
