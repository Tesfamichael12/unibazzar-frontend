import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingEditModal from "./ListingEditModal";
// TODO: Replace with actual API or Redux logic
const mockServices = [
  { id: 1, title: "Math Tutoring", status: "active" },
  { id: 2, title: "Essay Proofreading", status: "inactive" },
];

export default function MyServices() {
  const [services, setServices] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, data: null });

  useEffect(() => {
    setServices(mockServices);
  }, []);

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditModal({ open: true, data: item });
  };

  const handleSaveEdit = (updated) => {
    setServices((prev) =>
      prev.map((item) => (item.id === editModal.data.id ? { ...item, ...updated } : item))
    );
    setEditModal({ open: false, data: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">My Services</h2>
      <ul className="space-y-4">
        {services.map((item) => (
          <motion.li
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4"
          >
            <span>{item.title}</span>
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition cursor-pointer"
                onClick={() => handleEdit(item)}
                style={{ cursor: "pointer" }}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition cursor-pointer"
                onClick={() => handleDelete(item.id)}
                style={{ cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      <ListingEditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, data: null })}
        onSave={handleSaveEdit}
        initialData={editModal.data}
      />
    </motion.div>
  );
}
