import React, { useState, useEffect } from "react";

const ProductFormModal = ({
  isOpen,
  onClose,
  productData,
  onSuccess,
  token,
  apiBaseUrl,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_name: "",
    images: [],
  });
  const [imageFile, setImageFile] = useState(null); // For new image upload
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || "",
        category_name:
          productData.category_name || productData.category?.name || "",
        images: productData.images || [],
        //     ? productData.images[0].image_url
        //     : "",
      });
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category_name: "",
        images: [],
      });
      setImageFile(null);
    }
  }, [productData, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image_upload") {
      setImageFile(files[0]);
      setFormData((prev) => ({ ...prev, images: [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("Authentication token not found.");
      setIsLoading(false);
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.price);
    submissionData.append("category_name", formData.category_name);

    if (imageFile) {
      submissionData.append("image", imageFile);
    } else if (productData && formData.images && formData.images.length > 0) {
      // If not uploading a new file, but existing images were there and not cleared,
      // the API might need the existing image URL if it supports keeping it.
      // For PATCH, often you only send changed fields. If 'image' field is not sent, it might keep the old one.
      // If API requires image_url for keeping existing, this needs adjustment.
      // Based on typical PATCH behavior, not sending 'image' or 'image_url' would leave it unchanged.
      // If the API expects an explicit `image_url` to be sent to retain an image,
      // and `imageFile` is null, you might need to append `formData.images[0].image_url`
      // to `submissionData` under the key `image_url`.
      // For now, we assume if no new imageFile, the backend keeps the existing one if 'image' is not part of FormData.
    }

    // The API for merchant products uses PATCH for updates with image file,
    // and POST for creation with image file.
    // PUT was used before for JSON, but with FormData, PATCH is more conventional for partial updates.
    // Let's stick to PUT if the API doc implies it for /id/ endpoint with FormData,
    // otherwise PATCH is generally preferred for updates, especially with optional fields like image.
    // The provided API docs show:
    // PUT /products/merchant-products/{id}/ (Request body: ProductUpdateSerializer - has image_url)
    // PATCH /products/merchant-products/{id}/ (Request body: ProductUpdateSerializer - has image (file), image_url)
    // This confirms PATCH is the correct method for file uploads on update.

    const url = productData
      ? `${apiBaseUrl}/products/merchant-products/${productData.id}/`
      : `${apiBaseUrl}/products/merchant-products/`;
    const method = productData ? "PATCH" : "POST";

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: submissionData,
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "An error occurred." }));
        throw new Error(
          errData.detail ||
            Object.values(errData).join(", ") ||
            `HTTP error! status: ${response.status}`
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Failed to save product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4 pt-20">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {productData ? "Edit Product" : "Add New Product"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md break-words">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="category_name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category Name
            </label>
            <input
              type="text"
              name="category_name"
              id="category_name"
              value={formData.category_name}
              onChange={handleChange}
              placeholder="e.g., Electronics, Books, Clothing"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Image URL Input replaced with File Input */}
          <div>
            <label
              htmlFor="image_upload"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product Image
            </label>
            <input
              type="file"
              name="image_upload"
              id="image_upload"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-700 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-600"
            />
            {imageFile && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Selected file: {imageFile.name}
              </p>
            )}
            {!imageFile &&
              productData &&
              formData.images &&
              formData.images.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Current image:
                  </p>
                  <img
                    src={formData.images[0].image_url}
                    alt="Current product"
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    To change it, choose a new file above.
                  </p>
                </div>
              )}
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 dark:focus:ring-offset-gray-800"
            >
              {isLoading
                ? productData
                  ? "Saving..."
                  : "Adding..."
                : productData
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
