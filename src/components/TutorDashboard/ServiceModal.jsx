import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../redux/api/uniBazzarApi";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "used_like_new", label: "Used - Like New" },
  { value: "used_good", label: "Used - Good" },
  { value: "used_fair", label: "Used - Fair" },
];

export default function ServiceModal({
  isOpen,
  onClose,
  onSave,
  editingService,
}) {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category_id: "",
    phone_number: user?.phone_number || "",
    description: "",
    banner_photo: null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const res = await api.get("/api/products/categories/");
        if (res.data && Array.isArray(res.data.results)) {
          setCategories(res.data.results);
        } else if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
        setError("");
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (editingService) {
      setForm({
        title: editingService.title || "",
        price: editingService.price || "",
        category_id:
          editingService.category_id || editingService.category?.id || "",
        phone_number: editingService.phone_number || user?.phone_number || "",
        description: editingService.description || "",
        banner_photo: null, // always null for edit, only set if user uploads new
      });
    } else {
      setForm({
        title: "",
        price: "",
        category_id: "",
        phone_number: user?.phone_number || "",
        description: "",
        banner_photo: null,
      });
    }
  }, [editingService, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "banner_photo") {
      setForm({ ...form, banner_photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!user) {
      setError("You must be logged in to create a service.");
      setLoading(false);
      return;
    }
    if (!form.category_id) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }
    if (!form.phone_number) {
      setError("Phone number is required.");
      setLoading(false);
      return;
    }
    if (!form.description) {
      setError("Description is required.");
      setLoading(false);
      return;
    }
    if (!form.price) {
      setError("Price is required.");
      setLoading(false);
      return;
    }
    if (!form.title) {
      setError("Title is required.");
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      data.append("category_id", parseInt(form.category_id));
      data.append("description", form.description);
      data.append("price", String(form.price));
      data.append("phone_number", form.phone_number);
      data.append("title", form.title);
      if (form.banner_photo) {
        data.append("banner_photo", form.banner_photo);
      }
      let response;
      if (editingService) {
        response = await api.patch(
          `/api/products/tutor-services/${editingService.id}/`,
          data
        );
      } else {
        response = await api.post("/api/products/tutor-services/", data);
      }
      if (response.status === 201 || response.status === 200) {
        toast.success(
          `Service ${editingService ? "updated" : "added"} successfully!`
        );
        onSave();
        onClose();
      } else {
        // Show all backend error messages
        if (response.data && typeof response.data === "object") {
          errorMsg = Object.entries(response.data)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join(" | ");
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        let errorMessage = "";
        if (typeof errors === "object") {
          errorMessage = Object.entries(errors)
            .map(
              ([field, msg]) =>
                `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`
            )
            .join(" | ");
        } else if (typeof errors === "string") {
          errorMessage = errors;
        }
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="p-6 rounded-xl w-full max-w-lg shadow-2xl relative max-h-screen overflow-y-auto flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {editingService
            ? "Edit Tutoring Service"
            : "Add New Tutoring Service"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Calculus Tutoring"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Phone Number
            </label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="e.g., 0912345678"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Banner Photo
            </label>
            <input
              name="banner_photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a brief description..."
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
              Price (ETB)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., 300"
              type="number"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}
          <div className="flex gap-2 justify-end sticky bottom-0 bg-transparent pt-4 pb-2 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              disabled={loading}
            >
              {editingService ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
