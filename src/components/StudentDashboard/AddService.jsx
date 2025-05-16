import { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  "products",
  "educational materials",
  "tutoring",
  "food",
  "services",
  "Food & Drinks",
];
const conditions = [
  "New",
  "Used - Like New",
  "Used - Good",
  "Used - Fair",
];

export default function AddService() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    phone: "",
    tags: "",
    condition: "New",
    photo: null,
  });
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Service posted! (Mock)");
    setForm({
      title: "",
      price: "",
      category: "",
      description: "",
      phone: "",
      tags: "",
      condition: "New",
      photo: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200">Create New Service</h2>
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name / Title</label>
          <input
            name="title"
            value={form.title}
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
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
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
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g., 0912345678"
            className="w-full px-4 py-2 rounded border border-gray-300 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tags (comma-separated)</label>
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
            {conditions.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
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
          {form.photo && <span className="text-sm text-gray-600 dark:text-gray-300">{form.photo.name}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition cursor-pointer font-semibold text-lg"
          style={{ cursor: "pointer" }}
        >
          Post Listing
        </button>
      </form>
    </motion.div>
  );
}
