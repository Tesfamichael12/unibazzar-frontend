import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingEditModal from "./ListingEditModal";
// TODO: Replace with actual API or Redux logic
const mockListings = [
  { id: 1, title: "Used Laptop", status: "active" },
  { id: 2, title: "Textbook: Calculus", status: "inactive" },
];

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, data: null });

  useEffect(() => {
    // Replace with fetch from backend
    setListings(mockListings);
  }, []);

  const handleDelete = (id) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setEditModal({ open: true, data: item });
  };

  const handleSaveEdit = (updated) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === editModal.data.id ? { ...item, ...updated } : item
      )
    );
    setEditModal({ open: false, data: null });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">
        My Listings
      </h2>
      <ul className="space-y-4">
        {listings.map((item) => (
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
