import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";

/**
 * Product card component
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {Function} props.onAddToCart - Function to call when adding to cart
 * @param {string} props.uniqueKey - Unique key for the product card
 */
const ProductCard = ({ product, onAddToCart, uniqueKey }) => {
  if (!product) return null;

  // Determine the product type path for the link
  let productTypePath = "products";
  if (product.type === "merchant") {
    productTypePath = "merchant-products";
  } else if (product.type === "student") {
    productTypePath = "student-products";
  } else if (product.type === "tutor") {
    productTypePath = "tutor-services";
  }

  // Use product.category as string or object
  const categoryLabel =
    typeof product.category === "object" && product.category?.name
      ? product.category.name
      : product.category || "";

  const BACKEND_URL = "http://localhost:8000";
  // Helper function to get valid image URL
  function getValidImageUrl(url) {
    if (!url) return null;
    if (
      url.startsWith("http") ||
      url.startsWith("https") ||
      url.startsWith("https%3A")
    ) {
      return decodeURIComponent(url);
    }
    // Use as local media
    return `${BACKEND_URL}/media/${url.startsWith("/") ? url.slice(1) : url}`;
  }

  // Use product.image or fallback to product.photo, or null if neither exists
  const imageUrl = getValidImageUrl(product.image || product.photo);

  // Get rating and price safely
  const rating = product.rating || 0;
  const price = Number(product.price) || 0;

  return (
    <div key={uniqueKey} className="group">
      <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-white dark:bg-gray-800 flex items-center justify-center">
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
            New
          </span>
        )}
        <button
          className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          type="button"
        >
          <Heart size={18} />
        </button>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg border-4 border-blue-100 dark:border-gray-700 shadow-lg mx-auto transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 py-3 px-4 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 dark:bg-blue-700 hover:bg-black dark:hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer group-hover:cursor-pointer"
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
      <div className="text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
          {categoryLabel}
        </span>
        <h3 className="font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Link to={`/${productTypePath}/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="text-sm text-gray-700 dark:text-gray-200">
            {rating}
          </span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">
          ETB{isNaN(price) ? product.price : price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
