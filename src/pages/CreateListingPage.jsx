import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector
import api from "../redux/api/uniBazzarApi"; // Import the API client

function CreateListingPage() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth); // Get user and token

  const [formData, setFormData] = useState({
    name: "", // Changed from title to name
    price: "",
    category_id: "", // Store category ID
    description: "",
    phone_number: "",
    tags: "",
    condition: "new", // Default condition, relevant for students
    photo: null, // Added for photo upload
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Assuming the API client is configured with the base URL
        const response = await api.get("/api/products/categories/");
        if (response.data && Array.isArray(response.data.results)) { // Adjusted based on typical paginated response
          setCategories(response.data.results);
        } else if (Array.isArray(response.data)) {
            setCategories(response.data);
        } else {
          setCategories([]);
          console.warn("Categories response is not an array or paginated results:", response.data);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch categories. Please try again.");
        console.error("Fetch categories error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setLoading(true);

    if (!user || !token) {
      setError("You must be logged in to create a listing.");
      setLoading(false);
      return;
    }

    if (!formData.category_id) {
        setError("Please select a category.");
        setLoading(false);
        return;
    }

    const selectedCategory = categories.find(cat => cat.id === parseInt(formData.category_id));

    if (!selectedCategory) {
        setError("Selected category is invalid. Please try again.");
        setLoading(false);
        return;
    }

    let endpoint = "";
    // let payload = {}; // Payload will be FormData

    const data = new FormData();

    // Append common fields first
    data.append("category_id", parseInt(formData.category_id));
    // The backend expects the category object. This is tricky with FormData.
    // For now, we send category_id and let the backend resolve.
    // If the backend strictly needs category.name, category.slug, etc., in FormData,
    // they would need to be appended like:
    // data.append("category.name", selectedCategory.name); // (May not be standard)
    // Or flattened: data.append("category_name", selectedCategory.name);
    // The user's original spec showed a nested category object for JSON,
    // which doesn't translate directly to FormData.
    // We'll rely on category_id and the backend's ability to look up/use it.

    data.append("phone_number", formData.phone_number);
    data.append("description", formData.description);
    data.append("price", String(formData.price));

    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    if (user.role === "merchant") {
      endpoint = "/api/products/merchant-products/";
      data.append("name", formData.name);
      data.append("tags", formData.tags);
      // Photo is appended above if it exists
    } else if (user.role === "student") {
      endpoint = "/api/products/student-products/";
      data.append("name", formData.name);
      data.append("condition", formData.condition);
      data.append("tags", formData.tags);
      // Photo is appended above if it exists
    } else if (user.role === "tutor") {
      endpoint = "/api/products/tutor-services/";
      // Tutor payload is simpler as per spec (no name, no tags)
      // Description is used as title/main identifier for tutors
      // If tutors have a specific photo field like 'banner_photo', adjust data.append("photo", ...) accordingly
      // For now, assuming 'photo' or the backend handles if no photo for tutors via this form.
      // The original spec for tutor didn't list a photo/banner_photo field for POST.
    } else {
      setError("Invalid user role for creating a listing.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(endpoint, data); // data is now FormData

      if (response.status === 201 || response.status === 200) {
        setSuccessMessage("Listing created successfully!");
        // Reset form or navigate
        setFormData({
          name: "",
          price: "",
          category_id: "",
          description: "",
          phone_number: "",
          tags: "",
          condition: "new",
          photo: null, // Reset photo field
        });
        // navigate("/listings"); // Or to the new listing's page
      } else {
        setError(response.data?.detail || response.data?.message || "Failed to create listing.");
      }
    } catch (err) {
      console.error("Submit listing error:", err.response || err);
      let errorMessage = "Failed to create listing. Please try again.";
      if (err.response && err.response.data) {
        const errors = err.response.data;
        // Convert object errors to string
        if (typeof errors === 'object') {
          errorMessage = Object.entries(errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-lg space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
          Create New Listing
        </h2>

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-md">
            {successMessage}
          </div>
        )}

        {/* Name (Title) - Not for Tutors */}
        {user?.role !== "tutor" && (
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Name / Title</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={user?.role === "student" ? "e.g., Used Physics Textbook" : "e.g., Graphic Design Services"}
              value={formData.name}
              onChange={handleChange}
              className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required={user?.role !== "tutor"}
            />
          </div>
        )}

        {/* Price */}
        <div>
          <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Price (ETB)</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="e.g., 300"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            name="category_id"
            id="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            id="description"
            placeholder={user?.role === "tutor" ? "Describe your tutoring service, subjects, availability..." : "Write a brief description..."}
            value={formData.description}
            onChange={handleChange}
            className="border p-3 w-full rounded-md h-32 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            id="phone_number"
            placeholder="e.g., 0912345678"
            value={formData.phone_number}
            onChange={handleChange}
            className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Tags - Not for Tutors */}
        {user?.role !== "tutor" && (
          <div>
            <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder="e.g., physics, semester1, engineering"
              value={formData.tags}
              onChange={handleChange}
              className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {/* Condition - Only for Students */}
        {user?.role === "student" && (
          <div>
            <label htmlFor="condition" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Condition</label>
            <select
              name="condition"
              id="condition"
              value={formData.condition}
              onChange={handleChange}
              className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="new">New</option>
              <option value="used_like_new">Used - Like New</option>
              <option value="used_good">Used - Good</option>
              <option value="used_fair">Used - Fair</option>
            </select>
          </div>
        )}
        
        {/* Photo Upload - Field name "photo" based on error */}
        <div>
          <label htmlFor="photo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Photo
          </label>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image/*"
            onChange={handleChange}
            className="border p-3 w-full rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-blue-100 hover:file:bg-blue-100 dark:hover:file:bg-blue-600"
            // Making it required for merchant, optional for others for now
            required={user?.role === "merchant"} 
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListingPage;
