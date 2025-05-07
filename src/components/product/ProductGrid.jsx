import React from "react";
import ProductCard from "./ProductCard";

// Pagination component
function Pagination({
  count,
  next,
  previous,
  onPageChange,
  currentPage,
  pageSize,
}) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!previous || currentPage === 1}
      >
        &laquo; Prev
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-3 py-1 rounded ${
            num === currentPage
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!next || currentPage === totalPages}
      >
        Next &raquo;
      </button>
    </div>
  );
}

/**
 * ProductGrid component
 * @param {Object} props
 * @param {Array} props.products - Array of product objects
 * @param {boolean} props.loading - Loading state
 * @param {string|null} props.error - Error message
 * @param {Function} props.onAddToCart - Add to cart handler
 * @param {Function} props.onClearError - Error clear handler
 * @param {Object} props.paginationProps - Pagination properties
 */
const ProductGrid = ({
  products = [],
  loading,
  error,
  onAddToCart,
  onClearError,
  paginationProps,
}) => {
  if (loading) {
    return (
      <div className="text-center py-8 text-lg text-gray-600 dark:text-gray-300">
        Loading products...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
        {onClearError && (
          <button className="ml-2 text-xs underline" onClick={onClearError}>
            Dismiss
          </button>
        )}
      </div>
    );
  }
  if (!products.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No products found.
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={`${product.type || product.category?.name || "product"}-${
              product.id
            }-${idx}`}
            uniqueKey={`${
              product.type || product.category?.name || "product"
            }-${product.id}-${idx}`}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      {paginationProps && <Pagination {...paginationProps} />}
    </>
  );
};

export default ProductGrid;
