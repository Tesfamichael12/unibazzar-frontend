import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/Tabs";
import ProductGrid from "../components/product/ProductGrid";
// import { toast } from "react-toastify"; // Remove if not installed

const API_BASE = "http://localhost:8000/api/products";

const MarketplacePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category");

  const [merchantProducts, setMerchantProducts] = useState([]);
  const [studentProducts, setStudentProducts] = useState([]);
  const [tutorServices, setTutorServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state for each product type
  const [merchantPagination, setMerchantPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
  });
  const [studentPagination, setStudentPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
  });
  const [tutorPagination, setTutorPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
  });

  const dispatch = useDispatch();

  // Replace with your actual auth token logic
  const getAuthToken = () => {
    const authTokens = localStorage.getItem("authTokens");
    if (authTokens) {
      try {
        const parsedTokens = JSON.parse(authTokens);
        return parsedTokens.access || null;
      } catch (e) {
        console.error("Failed to parse authTokens from localStorage", e);
        return null;
      }
    }
    return null;
  };

  // Helper to fetch and check for JSON response
  const safeFetch = async (url) => {
    const token = getAuthToken();
    const fetchOptions = {}; // Initialize an empty options object
    if (token) {
      fetchOptions.headers = { Authorization: `Bearer ${token}` }; // Add headers only if token exists
    }

    const res = await fetch(url, fetchOptions); // Pass the configured options
    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      throw new Error(`Network error: ${res.status}`);
    }
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      throw new Error("Expected JSON, got: " + text.slice(0, 100));
    }
    return res.json();
  };

  // Helper to fetch paginated data
  const fetchPaginated = async (url, setProducts, setPagination) => {
    setLoading(true);
    setError(null);
    try {
      const data = await safeFetch(url);
      setProducts(Array.isArray(data.results) ? data.results : []);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: getPageFromUrl(url),
        pageSize: 10, // or parse from backend if dynamic
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract page number from URL
  function getPageFromUrl(url) {
    const match = url.match(/page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  // Fetch all product types and categories on mount
  useEffect(() => {
    fetchPaginated(
      `${API_BASE}/merchant-products/`,
      setMerchantProducts,
      setMerchantPagination
    );
    fetchPaginated(
      `${API_BASE}/student-products/`,
      setStudentProducts,
      setStudentPagination
    );
    fetchPaginated(
      `${API_BASE}/tutor-services/`,
      setTutorServices,
      setTutorPagination
    );
    safeFetch(`${API_BASE}/categories/`).then((categoriesData) => {
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      if (categoryParam) {
        const category = (
          Array.isArray(categoriesData) ? categoriesData : []
        ).find(
          (c) => c.name && c.name.toLowerCase() === categoryParam.toLowerCase()
        );
        if (category) setSelectedCategory(category.id);
      }
    });
    // eslint-disable-next-line
  }, [categoryParam]);

  // Helper to get products for a given static category
  const getProductsForCategory = (catId) => {
    switch (catId) {
      case "merchant":
        return merchantProducts;
      case "student":
        return studentProducts;
      case "tutor":
        return tutorServices;
      case "services":
        // Filter all products/services with category name 'Services' (case-insensitive)
        return [
          ...merchantProducts,
          ...studentProducts,
          ...tutorServices,
        ].filter((p) => {
          const catObj = categories.find((c) => c.id === p.category_id);
          return (
            catObj && catObj.name && catObj.name.toLowerCase() === "services"
          );
        });
      case "food":
        // Filter all products/services with category name 'Food' (case-insensitive)
        return [
          ...merchantProducts,
          ...studentProducts,
          ...tutorServices,
        ].filter((p) => {
          const catObj = categories.find((c) => c.id === p.category_id);
          return catObj && catObj.name && catObj.name.toLowerCase() === "food";
        });
      case "all":
      default:
        return [...merchantProducts, ...studentProducts, ...tutorServices];
    }
  };

  // Filter products based on active tab and selected category, then randomize order
  useEffect(() => {
    let products = [];
    if (staticCategories.some((cat) => cat.id === activeTab)) {
      products = getProductsForCategory(activeTab);
    } else {
      products = [...merchantProducts, ...studentProducts, ...tutorServices];
    }
    if (selectedCategory) {
      products = products.filter(
        (product) => product.category_id === selectedCategory
      );
    }
    // Randomize the order of products
    products = products.slice().sort(() => Math.random() - 0.5);
    setFilteredProducts(products);
  }, [
    activeTab,
    merchantProducts,
    studentProducts,
    tutorServices,
    selectedCategory,
    categories,
  ]);

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Handle add to cart (no toast)
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, price: Number(product.price) }));
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle error clear
  const clearError = () => setError(null);

  // Pagination handlers
  const handleMerchantPageChange = (page) => {
    const url =
      page === 1
        ? `${API_BASE}/merchant-products/`
        : `${API_BASE}/merchant-products/?page=${page}`;
    fetchPaginated(url, setMerchantProducts, setMerchantPagination);
  };
  const handleStudentPageChange = (page) => {
    const url =
      page === 1
        ? `${API_BASE}/student-products/`
        : `${API_BASE}/student-products/?page=${page}`;
    fetchPaginated(url, setStudentProducts, setStudentPagination);
  };
  const handleTutorPageChange = (page) => {
    const url =
      page === 1
        ? `${API_BASE}/tutor-services/`
        : `${API_BASE}/tutor-services/?page=${page}`;
    fetchPaginated(url, setTutorServices, setTutorPagination);
  };

  // Build category filter buttons (including static types)
  const staticCategories = [
    { id: "all", name: "All" },
    { id: "merchant", name: "Products" },
    { id: "student", name: "Notes & Textbooks" },
    { id: "tutor", name: "Tutoring" },
    { id: "services", name: "Services" },
    { id: "food", name: "Food" },
  ];
  // Merge API categories (if any) with static, avoiding duplicates
  let backendCategories = categories.filter(
    (cat) =>
      !staticCategories.some(
        (s) => s.name.toLowerCase() === cat.name?.toLowerCase()
      )
  );
  const allCategoryButtons = [...staticCategories, ...backendCategories];

  return (
    <div className="space-y-6 pt-10 m-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        {/* Removed duplicated Tabs category navigation */}
      </div>
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {allCategoryButtons.map((cat) => {
          // Only show button if there are products for this category/type
          let hasProducts = false;
          if (
            [
              "all",
              "merchant",
              "student",
              "tutor",
              "services",
              "food",
            ].includes(cat.id)
          ) {
            hasProducts = getProductsForCategory(cat.id).length > 0;
          } else {
            hasProducts = [
              ...merchantProducts,
              ...studentProducts,
              ...tutorServices,
            ].some((p) => p.category_id === cat.id);
          }
          if (!hasProducts) return null;
          const isActive = activeTab === cat.id || selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg animate-pulse-glow"
                    : "text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-105 hover:shadow-lg"
                }
                cursor-pointer group relative overflow-hidden`}
              style={{ position: "relative" }}
              onClick={() => {
                if (
                  [
                    "all",
                    "merchant",
                    "student",
                    "tutor",
                    "services",
                    "food",
                  ].includes(cat.id)
                ) {
                  setActiveTab(cat.id);
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(cat.id);
                  setActiveTab("all");
                }
              }}
            >
              <span className="relative z-10">{cat.name}</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/10 blur-lg animate-pulse pointer-events-none"></span>
            </button>
          );
        })}
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
          {error}
          <button className="ml-2 text-xs underline" onClick={clearError}>
            Dismiss
          </button>
        </div>
      )}
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        error={error}
        onAddToCart={handleAddToCart}
        onClearError={clearError}
        paginationProps={{
          count:
            activeTab === "all"
              ? merchantPagination.count +
                studentPagination.count +
                tutorPagination.count
              : categories.find((c) => (c.slug || c.id) === activeTab)?.count ||
                merchantPagination.count,
          next:
            activeTab === "all"
              ? merchantPagination.next ||
                studentPagination.next ||
                tutorPagination.next
              : merchantPagination.next,
          previous:
            activeTab === "all"
              ? merchantPagination.previous ||
                studentPagination.previous ||
                tutorPagination.previous
              : merchantPagination.previous,
          onPageChange: (page) => {
            if (activeTab === "all") {
              // For 'all', update all paginations
              handleMerchantPageChange(page);
              handleStudentPageChange(page);
              handleTutorPageChange(page);
            } else if (activeTab === "products" || activeTab === "merchant") {
              handleMerchantPageChange(page);
            } else if (
              activeTab === "educational-materials" ||
              activeTab === "student"
            ) {
              handleStudentPageChange(page);
            } else if (activeTab === "tutoring" || activeTab === "tutor") {
              handleTutorPageChange(page);
            } else {
              // fallback
              handleMerchantPageChange(page);
            }
          },
          currentPage:
            activeTab === "all"
              ? Math.max(
                  merchantPagination.currentPage,
                  studentPagination.currentPage,
                  tutorPagination.currentPage
                )
              : merchantPagination.currentPage,
          pageSize: merchantPagination.pageSize,
        }}
      />
    </div>
  );
};

export default MarketplacePage;
