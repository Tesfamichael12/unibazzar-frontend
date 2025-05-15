import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import uniBazzarApi from "../../redux/api/uniBazzarApi"; // Assuming this is your API handler

const ServiceFormModal = ({
  isOpen,
  onClose,
  onServiceSaved,
  service,
  token,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "", // Consider fetching categories or defining a list
    price: "",
    // Add other service-specific fields here, e.g., duration, location, availability_schedule
    // For simplicity, we'll start with these basic fields.
    // Example: availability_schedule: { days: [], startTime: '', endTime: '' }
    is_available: true, // Default to available
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]); // Example for dynamic categories

  // Example: Fetch categories if you have an endpoint for them
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const response = await uniBazzarApi.get("/api/service-categories/", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // setCategories(response.data || []);
        // For now, using placeholder categories:
        setCategories([
          { id: "tutoring", name: "Tutoring" },
          { id: "writing", name: "Writing & Translation" },
          { id: "design", name: "Graphic Design" },
          { id: "programming", name: "Programming & Tech" },
          { id: "consulting", name: "Consulting" },
          { id: "other", name: "Other" },
        ]);
      } catch (error) {
        console.error("Failed to fetch service categories:", error);
        toast.error("Could not load service categories.");
      }
    };
    if (isOpen && token) {
      fetchCategories();
    }
  }, [isOpen, token]);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || "",
        description: service.description || "",
        category: service.category || "",
        price: service.price || "",
        is_available:
          service.is_available !== undefined ? service.is_available : true,
        // ... map other fields from service object
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        is_available: true,
        // ... reset other fields
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiPath = service
      ? `/api/services/tutor-services/${service.id}/` // Endpoint for updating a service
      : "/api/services/tutor-services/"; // Endpoint for creating a new service
    const method = service ? "patch" : "post"; // Use PATCH for updates, POST for creation

    // Basic validation
    if (!formData.title || !formData.price || !formData.category) {
      toast.error("Title, Category, and Price are required.");
      setIsLoading(false);
      return;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Please enter a valid price.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...formData, price: parseFloat(formData.price) };
      await uniBazzarApi[method](apiPath, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(`Service ${service ? "updated" : "created"} successfully!`);
      onServiceSaved();
    } catch (error) {
      console.error(
        `Failed to ${service ? "update" : "create"} service:`,
        error.response?.data || error.message
      );
      toast.error(
        `Failed to ${service ? "update" : "create"} service. ${
          error.response?.data?.detail || "Please try again."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {service ? "Edit Service" : "Add New Service"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Service Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Price (ETB)
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 500.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_available"
              name="is_available"
              type="checkbox"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            />
            <label
              htmlFor="is_available"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              Service is currently available
            </label>
          </div>

          {/* Add more fields here as needed, e.g., for duration, location, specific availability times */}
          {/* Example for a more complex field like availability schedule:
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Availability Schedule</h4>
            // ... inputs for days, start time, end time ...
          </div>
          */}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : service ? (
                "Save Changes"
              ) : (
                "Add Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
