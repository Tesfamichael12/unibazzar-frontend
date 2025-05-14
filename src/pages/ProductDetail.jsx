import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import ReviewSection from "../components/review/ReviewSection";
import { FiShoppingCart, FiArrowLeft, FiPhone } from "react-icons/fi";

const ProductDetail = () => {
  const { type: rawType, id } = useParams();
  const type = rawType || "merchant";
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // Generate a random views count for demo purposes
  const [views] = useState(() => Math.floor(Math.random() * 900 + 100));
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Helper to determine if a category is educational
    const isEducationalCategory = (catName) => {
      if (!catName) return false;
      const name = catName.toLowerCase();
      return (
        name.includes("educational material") ||
        name.includes("notes") ||
        name.includes("textbook")
      );
    };
    // Try merchant first, then check category, then try student if needed
    const tryFetch = async () => {
      // Try merchant-products first
      let res = await fetch(
        `http://127.0.0.1:8000/api/products/merchant-products/${id}/`
      );
      let contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        let data = await res.json();
        const catName = data.category?.name || "";
        if (isEducationalCategory(catName)) {
          // Refetch from student-products if educational
          res = await fetch(
            `http://127.0.0.1:8000/api/products/student-products/${id}/`
          );
          contentType = res.headers.get("content-type");
          if (
            res.ok &&
            contentType &&
            contentType.includes("application/json")
          ) {
            data = await res.json();
            setProduct(data);
            setLoading(false);
            return;
          } else {
            setError("Product not found in student products");
            setLoading(false);
            return;
          }
        } else {
          setProduct(data);
          setLoading(false);
          return;
        }
      } else {
        // If not found in merchant, try student-products
        res = await fetch(
          `http://127.0.0.1:8000/api/products/student-products/${id}/`
        );
        contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setProduct(data);
          setLoading(false);
          return;
        }
        // If not found in student, try tutor-services
        res = await fetch(
          `http://127.0.0.1:8000/api/products/tutor-services/${id}/`
        );
        contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setProduct(data);
          setLoading(false);
          return;
        }
        let errorMsg = `Product not found (status ${res.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errJson = await res.json().catch(() => null);
          if (errJson && errJson.detail) errorMsg = errJson.detail;
        }
        setError(errorMsg);
        setLoading(false);
      }
    };
    tryFetch();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-white">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
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
          <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg font-inter">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500 dark:text-red-400">
        <p className="mb-4 text-lg font-semibold">{error}</p>
        <Link
          to="/listings"
          className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  if (product) {
    // Tutor service: use banner_photo and description
    const isTutor =
      product.category &&
      (product.category.name === "tutoring" ||
        product.category.slug === "tutoring");
    const imageUrl = isTutor
      ? product.banner_photo
      : product.photo || product.image;
    const displayName = isTutor
      ? product.title || product.description // Refined to prefer title, then description
      : product.name || product.title;
    return (
      <section className="pt-24 py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh]">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-blue-100 dark:border-blue-900 relative">
          <div className="md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-8">
            <img
              src={imageUrl}
              alt={displayName}
              className="rounded-2xl w-full max-h-96 object-contain shadow-xl border-4 border-blue-100 dark:border-blue-700 bg-white dark:bg-gray-900"
            />
          </div>
          <div className="md:w-1/2 p-10 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="mb-2">
                    <span
                      className="block mb-1 flex items-center gap-1 text-[11px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold shadow animate-pulse-glow overflow-hidden w-fit"
                      style={{ minWidth: "60px" }}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-green-500 drop-shadow-glow animate-glow-wave"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3C5 3 1.73 7.11 1.13 8c-.15.22-.15.52 0 .74C1.73 10.89 5 15 10 15s8.27-4.11 8.87-5c.15-.22.15-.52 0-.74C18.27 7.11 15 3 10 3zm0 10c-3.31 0-6.31-2.53-7.44-4C3.69 7.53 6.69 5 10 5s6.31 2.53 7.44 4C16.31 10.47 13.31 13 10 13zm0-6a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      {views} views
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {displayName}
                    </h2>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                {product.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full font-medium">
                  Category: {product.category?.name}
                </span>
                {product.tags && (
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full font-medium">
                    Tags: {product.tags}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-6 mb-6">
                <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {product.price} ETB
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <FiPhone className="w-4 h-4 text-blue-400" />
                  Contact: {product.phone_number}
                </span>
              </div>
              {product.nearest_university && (
                <div className="mb-2 text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Nearest University: {product.nearest_university}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-base flex items-center gap-2"
                onClick={() =>
                  dispatch(
                    addToCart({
                      id: product.id,
                      title: product.name,
                      price: product.price,
                      imageUrl: product.photo || product.image,
                    })
                  )
                }
              >
                <FiShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link
                to="/listings"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer text-base shadow flex items-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Listings
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <ReviewSection type={type} objectId={product.id} />
        </div>
      </section>
    );
  }
};

export default ProductDetail;
// CSS for glow effect is now in src/index.css
