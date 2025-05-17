import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import api from "../../redux/api/uniBazzarApi";
import ListingEditModal from "./ListingEditModal";

export default function MyServices() {
  const { user } = useSelector((state) => state.auth);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, data: null });
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    api
      .get(`/api/users/${user.id}/listings/`)
      .then((res) => {
        setListings(res.data.student_products || []);
      })
      .catch((err) => {
        setError("Failed to fetch listings");
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/products/student-products/${id}/`);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditForm({
      id: item.id,
      title: item.name || "",
      price: item.price || "",
      category: item.category?.name || "",
      description: item.description || "",
      phone: item.phone_number || "",
      tags: item.tags || "",
      condition: item.condition || "New",
      photo: null, // We'll show the old photo, but new upload is optional
      oldPhoto: item.photo || null,
    });
    setEditModal({ open: true, data: item });
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setEditForm({ ...editForm, photo: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", editForm.title);
      data.append("price", editForm.price);
      data.append("category", editForm.category);
      data.append("description", editForm.description);
      data.append("phone_number", editForm.phone);
      data.append("tags", editForm.tags);
      data.append("condition", editForm.condition);
      if (editForm.photo) data.append("photo", editForm.photo);
      await api.patch(`/api/products/student-products/${editForm.id}/`, data);
      setListings((prev) =>
        prev.map((item) =>
          item.id === editForm.id
            ? {
                ...item,
                name: editForm.title,
                price: editForm.price,
                category: { ...item.category, name: editForm.category },
                description: editForm.description,
                phone_number: editForm.phone,
                tags: editForm.tags,
                condition: editForm.condition,
                photo: editForm.photo ? URL.createObjectURL(editForm.photo) : item.photo,
              }
            : item
        )
      );
      setEditModal({ open: false, data: null });
      setEditForm(null);
    } catch (err) {
      setError("Failed to update service. Please try again.");
    }
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
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-6">
        {listings.map((item) => (
          <motion.li
            key={item.id}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-lg p-6 gap-6"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-40 h-40 object-cover rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-md"
                />
              )}
              <div className="flex flex-col gap-2">
                <div className="font-bold text-2xl text-blue-100 dark:text-blue-200">
                  {item.name}
                </div>
                <div className="text-lg text-gray-200 dark:text-gray-300">
                  {item.description}
                </div>
                <div className="text-base text-gray-300 dark:text-gray-400 mt-1 flex flex-wrap gap-4">
                  <span>
                    Price:{" "}
                    <span className="font-semibold">{item.price} ETB</span>
                  </span>
                  <span>Category: {item.category?.name}</span>
                  <span>Condition: {item.condition}</span>
                </div>
                <div className="text-base text-gray-400 dark:text-gray-400 mt-1 flex flex-wrap gap-4">
                  <span>Phone: {item.phone_number}</span>
                  <span>Tags: {item.tags}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 md:mt-0 md:ml-6">
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer font-semibold text-lg shadow"
                onClick={() => handleEdit(item)}
                style={{ cursor: "pointer" }}
              >
                Edit
              </button>
              <button
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition cursor-pointer font-semibold text-lg shadow"
                onClick={() => handleDelete(item.id)}
                style={{ cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </motion.li>
        ))}
      </ul>
      {/* Edit Modal - same format as AddListing, autofilled */}
      {editModal.open && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-lg max-h-screen overflow-y-auto"
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">
              Edit Listing
            </h3>
            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name / Title</label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  placeholder="e.g., Used Physics Textbook"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price (ETB)</label>
                <input
                  name="price"
                  value={editForm.price}
                  onChange={handleEditFormChange}
                  placeholder="e.g., 300"
                  type="number"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <input
                  name="category"
                  value={editForm.category}
                  onChange={handleEditFormChange}
                  placeholder="Category"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  placeholder="Write a brief description..."
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  placeholder="e.g., 0912345678"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Tags (comma-separated)
                </label>
                <input
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditFormChange}
                  placeholder="e.g., physics, semester1, engineering"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Condition</label>
                <input
                  name="condition"
                  value={editForm.condition}
                  onChange={handleEditFormChange}
                  placeholder="Condition"
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Product Photo</label>
                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
                />
                {editForm.oldPhoto && !editForm.photo && (
                  <img
                    src={editForm.oldPhoto}
                    alt="Current"
                    className="w-24 h-24 mt-2 object-cover rounded-md border"
                  />
                )}
                {editForm.photo && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {editForm.photo.name}
                  </span>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditModal({ open: false, data: null });
                    setEditForm(null);
                  }}
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
        </div>
      )}
    </motion.div>
  );
}
