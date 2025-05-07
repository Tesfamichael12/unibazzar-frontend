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
  const getAuthToken = () => localStorage.getItem("token");

  // Helper to fetch and check for JSON response
  const safeFetch = async (url) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
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
    if (!getAuthToken()) {
      navigate("/login");
      return;
    }
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

  // Filter products based on active tab and selected category, then randomize order
  useEffect(() => {
    let products = [];
    switch (activeTab) {
      case "merchant":
        products = merchantProducts;
        break;
      case "student":
        products = studentProducts;
        break;
      case "tutor":
        products = tutorServices;
        break;
      case "all":
      default:
        products = [...merchantProducts, ...studentProducts, ...tutorServices];
        break;
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
    { id: "food", name: "Food" },
  ];
  // Merge API categories (if any) with static, avoiding duplicates
  const allCategoryButtons = [
    ...staticCategories,
    ...categories.filter(
      (cat) =>
        !staticCategories.some(
          (s) => s.name.toLowerCase() === cat.name?.toLowerCase()
        )
    ),
  ];

  return (
    <div className="space-y-6 pt-10 m-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full md:w-auto"
        ></Tabs>
      </div>
      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {allCategoryButtons.map((cat) => {
          // Only show button if there are products for this category/type
          let hasProducts = false;
          if (cat.id === "all") {
            hasProducts =
              merchantProducts.length > 0 ||
              studentProducts.length > 0 ||
              tutorServices.length > 0;
          } else if (cat.id === "merchant") {
            hasProducts = merchantProducts.length > 0;
          } else if (cat.id === "student") {
            hasProducts = studentProducts.length > 0;
          } else if (cat.id === "tutor") {
            hasProducts = tutorServices.length > 0;
          } else if (cat.id === "food") {
            // If you have a foodProducts array, check it here. Otherwise, hide.
            hasProducts = false;
          } else {
            // For dynamic categories, check if any product matches the category id
            hasProducts = [
              ...merchantProducts,
              ...studentProducts,
              ...tutorServices,
            ].some((p) => p.category_id === cat.id);
          }
          if (!hasProducts) return null;
          return (
            <button
              key={cat.id}
              className={`px-3 py-1 rounded ${
                activeTab === cat.id || selectedCategory === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              }`}
              onClick={() => {
                if (
                  ["all", "merchant", "student", "tutor", "food"].includes(
                    cat.id
                  )
                ) {
                  setActiveTab(cat.id);
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(cat.id);
                  setActiveTab("all");
                }
              }}
            >
              {cat.name}
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
        paginationProps={(() => {
          if (activeTab === "merchant") {
            return {
              ...merchantPagination,
              onPageChange: handleMerchantPageChange,
            };
          } else if (activeTab === "student") {
            return {
              ...studentPagination,
              onPageChange: handleStudentPageChange,
            };
          } else if (activeTab === "tutor") {
            return {
              ...tutorPagination,
              onPageChange: handleTutorPageChange,
            };
          } else {
            // For 'all', show no pagination or implement combined pagination if needed
            return null;
          }
        })()}
      />
    </div>
  );
};

export default MarketplacePage;
