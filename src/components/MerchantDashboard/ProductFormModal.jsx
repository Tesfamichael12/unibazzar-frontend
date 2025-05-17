import { useState, useEffect } from "react";
import api from "../../redux/api/uniBazzarApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "used_like_new", label: "Used - Like New" },
  { value: "used_good", label: "Used - Good" },
  { value: "used_fair", label: "Used - Fair" },
];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  productData,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    phone_number: "",
    tags: "",
    condition: "new",
    photo: null,
  });
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api
      .get("/api/products/categories/")
      .then((res) => {
        if (res.data && Array.isArray(res.data.results)) {
          setCategories(res.data.results);
        } else if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          setCategories([]);
        }
        setError("");
      })
      .catch(() => {
        setCategories([]);
        setError("Failed to fetch categories.");
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (productData) {
      setForm({
        name: productData.name || "",
        price: productData.price || "",
        category_id: productData.category?.id?.toString() || "",
        description: productData.description || "",
        phone_number: productData.phone_number || "",
        tags: productData.tags || "",
        condition: productData.condition || "new",
        photo: null,
      });
    } else {
      setForm({
        name: "",
        price: "",
        category_id: "",
        description: "",
        phone_number: "",
        tags: "",
        condition: "new",
        photo: null,
      });
    }
  }, [productData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    if (!form.category_id) {
      setError("Please select a category.");
      setLoading(false);
      return;
    }
    const selectedCategory = categories.find(
      (cat) => cat.id === parseInt(form.category_id)
    );
    if (!selectedCategory) {
      setError("Selected category is invalid. Please try again.");
      setLoading(false);
      return;
    }
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", String(form.price));
      data.append("category_id", parseInt(form.category_id));
      data.append("description", form.description);
      data.append("phone_number", form.phone_number);
      data.append("tags", form.tags);
      data.append("condition", form.condition);
      if (form.photo) data.append("photo", form.photo);
      let response;
      if (productData && productData.id) {
        response = await api.patch(
          `/api/products/merchant-products/${productData.id}/`,
          data
        );
      } else {
        response = await api.post("/api/products/merchant-products/", data);
      }
      if (response.status === 201 || response.status === 200) {
        toast.success(
          productData
            ? "Product updated successfully!"
            : "Product posted successfully!"
        );
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setError(
          response.data?.detail ||
            response.data?.message ||
            "Failed to save product."
        );
      }
    } catch (err) {
      let errorMessage = "Failed to save product. Please try again.";
      if (err.response && err.response.data) {
        const errors = err.response.data;
        if (typeof errors === "object") {
          errorMessage = Object.entries(errors)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("; ");
        } else {
          errorMessage = errors.detail || errors.message || errorMessage;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 w-full max-w-lg max-h-screen overflow-y-auto"
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">
          {productData ? "Edit Product" : "Add New Product"}
        </h2>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name / Title</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., New Product"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price (ETB)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g., 300"
              type="number"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a brief description..."
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
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
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., electronics, sale, new"
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Condition</label>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
              required
            >
              {conditionOptions.map((cond) => (
                <option key={cond.value} value={cond.value}>
                  {cond.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Product Photo</label>
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            />
            {form.photo && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {form.photo.name}
              </span>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-semibold text-base"
              style={{ cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition font-semibold text-base"
              style={{ cursor: loading ? "wait" : "pointer" }}
              disabled={loading}
            >
              {loading
                ? productData
                  ? "Saving..."
                  : "Posting..."
                : productData
                ? "Save Changes"
                : "Post Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
