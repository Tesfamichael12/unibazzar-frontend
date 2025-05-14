import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import ProductFormModal from "../../components/MerchantDashboard/ProductFormModal"; // Uncommented
// import api from '../../redux/api/uniBazzarApi'; // Assuming a configured axios instance

const API_BASE_URL = "http://localhost:8000/api"; // Or your actual API base URL

function MerchantProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for create, product object for edit

  const { token } = useSelector((state) => state.auth); // Assuming token is in auth state

  const fetchMerchantProducts = useCallback(async () => {
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // const response = await api.get('/products/merchant-products/'); // Using a pre-configured axios instance
      // For now, using fetch directly:
      const response = await fetch(
        `${API_BASE_URL}/products/merchant-products/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to fetch products" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setProducts(data.results || data); // Adjust based on your API response structure
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch merchant products:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMerchantProducts();
  }, [fetchMerchantProducts]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setShowFormModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/merchant-products/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to delete product" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
      // Optionally, show a success message
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete product:", err);
      // Optionally, show an error message to the user
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowFormModal(false);
    fetchMerchantProducts(); // Refresh the list
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen pt-28">
      {" "}
      {/* Changed pt-20 to pt-28 for more top padding */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Manage Your Products
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-150 ease-in-out"
        >
          <FaPlus className="mr-2" /> Add New Product
        </button>
      </div>
      {products.length === 0 && !loading && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            You haven't added any products yet.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Click "Add New Product" to get started!
          </p>
        </div>
      )}
      {products.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.photo ? ( // Changed from product.images && product.images.length > 0
                        <img
                          src={product.photo} // Changed from product.images[0].image_url
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-600 mr-3"></div>
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    ETB {parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {product.category_name || product.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3 p-1"
                      title="Edit Product"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title="Delete Product"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showFormModal && (
        <ProductFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          productData={editingProduct}
          onSuccess={handleFormSubmitSuccess}
          token={token}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

export default MerchantProductManagementPage;
