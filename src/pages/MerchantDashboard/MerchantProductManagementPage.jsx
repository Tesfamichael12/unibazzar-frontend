import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import ProductFormModal from "../../components/MerchantDashboard/ProductFormModal"; // Uncommented
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
// import api from '../../redux/api/uniBazzarApi'; // Assuming a configured axios instance

const API_BASE_URL = "http://localhost:8000/api"; // Or your actual API base URL

function MerchantProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for create, product object for edit
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const { token, user } = useSelector((state) => state.auth); // Get user from auth state

  const fetchMerchantProducts = useCallback(async () => {
    if (!token || !user?.id) {
      setError("Authentication or user info not found. Please log in.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch merchant's own listings (products) using user-specific endpoint
      const response = await fetch(
        `${API_BASE_URL}/users/${user.id}/listings/`,
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
      // For merchants, the API should return merchant_products
      setProducts(data.merchant_products || data.results || data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch merchant products:", err);
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

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

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    setDeleteModal({
      open: true,
      id: productId,
      name: product?.name || "this product",
    });
  };

  const confirmDelete = async () => {
    if (!token) {
      setError("Authentication token not found.");
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/merchant-products/${deleteModal.id}/`,
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
        prevProducts.filter((p) => p.id !== deleteModal.id)
      );
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete product:", err);
    } finally {
      setDeleteModal({ open: false, id: null, name: "" });
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
    <div className="container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen pt-20 pr-5 pl-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Manage Your Products
        </h1>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300 ease-in-out transform hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] cursor-pointer"
        >
          <FaPlus className="mr-2" /> Add New Product
        </button>
      </div>
      {products.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            You haven't added any products yet.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Click "Add New Product" to get started!
          </p>
        </motion.div>
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
              {products.map((product, idx) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.07,
                    type: "spring",
                    stiffness: 80,
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap align-top">
                    <div className="flex items-start gap-6">
                      {product.photo ? (
                        <motion.img
                          src={product.photo}
                          alt={product.name}
                          className="w-28 h-28 rounded-xl object-cover border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-xl bg-gray-200 dark:bg-gray-600"></div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {product.name}
                        </span>
                        {product.description && (
                          <span className="text-gray-700 dark:text-gray-300 text-base">
                            {product.description}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            Price:{" "}
                            <span className="font-semibold">
                              ETB {parseFloat(product.price).toFixed(2)}
                            </span>
                          </span>
                          <span>
                            Category:{" "}
                            {product.category_name ||
                              product.category?.name ||
                              "N/A"}
                          </span>
                          {product.condition && (
                            <span>Condition: {product.condition}</span>
                          )}
                          {product.phone_number && (
                            <span>Phone: {product.phone_number}</span>
                          )}
                          {product.tags && <span>Tags: {product.tags}</span>}
                          {product.created_at && (
                            <span>
                              Created:{" "}
                              {new Date(
                                product.created_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {product.updated_at && (
                            <span>
                              Updated:{" "}
                              {new Date(
                                product.updated_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                          {product.status && (
                            <span>Status: {product.status}</span>
                          )}
                          {/* Add any other fields as needed */}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-700 dark:text-gray-300 align-top">
                    ETB {parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-700 dark:text-gray-300 align-top">
                    {product.category_name || product.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium align-top">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3 p-2 transition duration-300 ease-in-out transform hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(99,102,241,0.7)] cursor-pointer rounded-md"
                      title="Edit Product"
                    >
                      <FaEdit size={22} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 transition duration-300 ease-in-out transform hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] cursor-pointer rounded-md"
                      title="Delete Product"
                    >
                      <FaTrash size={22} />
                    </button>
                  </td>
                </motion.tr>
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
      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, id: null, name: "" })}
        onConfirm={confirmDelete}
        itemName={deleteModal.name}
      />
    </div>
  );
}

export default MerchantProductManagementPage;
