import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../redux/api/uniBazzarApi";
import { motion } from "framer-motion";

const conditionOptions = [
  { value: "new", label: "New" },
  { value: "used_like_new", label: "Used - Like New" },
  { value: "used_good", label: "Used - Good" },
  { value: "used_fair", label: "Used - Fair" },
];

export default function AddService() {
  const { user } = useSelector((state) => state.auth);
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
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
    // eslint-disable-next-line
  }, []);

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
      // Use the same endpoint as AddListing
      const response = await api.post("/api/products/student-products/", data);
      if (response.status === 201 || response.status === 200) {
        setSuccess("Service posted successfully!");
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
      } else {
        setError(
          response.data?.detail ||
            response.data?.message ||
            "Failed to create service."
        );
      }
    } catch (err) {
      let errorMessage = "Failed to create service. Please try again.";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">
        Create New Service
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
            placeholder="e.g., Math Tutoring"
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
            placeholder="e.g., math, tutoring, semester1"
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
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition cursor-pointer font-semibold text-lg"
          style={{ cursor: loading ? "wait" : "pointer" }}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </motion.div>
  );
}
