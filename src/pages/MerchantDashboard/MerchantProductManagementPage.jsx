import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBoxOpen,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hamburger button for dashboard sidebar (lower, modern, animated, with label) */}
      <motion.button
        initial={{ y: -30, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="fixed top-24 left-4 z-50 lg:hidden bg-gray-900 text-white p-1.5 rounded-md shadow-lg focus:outline-none flex items-center gap-1 border border-blue-400/40 hover:bg-gray-800 cursor-pointer"
        style={{ fontSize: 18 }}
        onClick={() => setSidebarOpen((v) => !v)}
        aria-label="Open dashboard sidebar menu"
      >
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: sidebarOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <HiOutlineSquares2X2 className="text-lg text-blue-400" />
        </motion.span>
        <span className="text-[10px] font-semibold tracking-wide uppercase text-blue-300 ml-1">
          Dashboard
        </span>
        <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-900/60 text-[9px] text-blue-200 font-bold border border-blue-400/30">
          SIDEBAR
        </span>
      </motion.button>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className={`w-64 bg-white dark:bg-gray-900 shadow-xl flex flex-col py-8 px-4 border-r border-gray-200 dark:border-gray-800 fixed top-0 left-0 h-screen z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:flex lg:translate-x-0 mt-16 lg:mt-0 pt-20`}
        style={{ minWidth: 256 }}
      >
        <div className="mb-10 text-2xl font-bold text-blue-700 dark:text-blue-300 text-center flex justify-between items-center">
          <span>Merchant Panel</span>
          {/* Close button for mobile */}
          <button
            className="lg:hidden text-gray-400 hover:text-gray-700 p-1 ml-2 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <a
            href="/merchant-dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <HiOutlineSquares2X2 className="text-lg" /> Dashboard
          </a>
          <a
            href="/merchant/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <FaBoxOpen className="text-lg" /> Products
          </a>
          <a
            href="/merchant/earnings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-700 dark:hover:text-blue-200 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <FaMoneyBillWave className="text-lg" /> Earnings
          </a>
        </nav>
      </motion.aside>
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></motion.div>
      )}
      {/* Main Content */}
      <div className="flex-1 p-5 lg:ml-64 transition-all duration-300">
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
    </div>
  );
}

export default MerchantProductManagementPage;
