import { useState } from "react";
import { motion } from "framer-motion";

export default function ListingEditModal({
  open,
  onClose,
  onSave,
  initialData,
}) {
  const [form, setForm] = useState(
    initialData || { title: "", description: "", price: "" }
  );

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-md"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
      >
        <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">
          Edit Listing
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            type="number"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            required
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
