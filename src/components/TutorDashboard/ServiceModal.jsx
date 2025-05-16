import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ServiceModal({
  isOpen,
  onClose,
  onSave,
  editingService,
}) {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    rate: "",
    status: "Active",
  });

  useEffect(() => {
    if (editingService) {
      setFormData(editingService);
    } else {
      setFormData({
        subject: "",
        description: "",
        rate: "",
        status: "Active",
      });
    }
  }, [editingService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.rate) {
      alert("Subject and rate are required.");
      return;
    }
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingService ? "Edit Service" : "Add New Service"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm text-gray-300">
              Rate (e.g. $20/hr)
            </label>
            <input
              type="text"
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          >
            {editingService ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
}
