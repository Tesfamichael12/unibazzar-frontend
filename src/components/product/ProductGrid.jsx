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

  // Ellipsis logic
  const pageNumbers = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 4) pageNumbers.push("...");
    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      if (i !== 1 && i !== totalPages && !pageNumbers.includes(i))
        pageNumbers.push(i);
    }
    if (currentPage < totalPages - 3) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8 select-none">
      <button
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:cursor-pointer"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <span className="inline-block align-middle">&#8592;</span>
      </button>
      {pageNumbers.map((num, idx) =>
        num === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={`page-${num}`}
            className={`px-3 py-1 rounded transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400/60
                ${
                  num === currentPage
                    ? "bg-blue-600 text-white scale-105 shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
                }
              `}
            onClick={() => onPageChange(num)}
            style={{ minWidth: 36 }}
          >
            {num}
          </button>
        )
      )}
      <button
        className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:cursor-pointer"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <span className="inline-block align-middle">&#8594;</span>
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
      {/* Top right pagination */}
      {paginationProps && (
        <div className="flex justify-end items-center mb-4">
          <div className="inline-block">
            <Pagination {...paginationProps} />
          </div>
        </div>
      )}
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
      {/* Bottom pagination */}
      {paginationProps && <Pagination {...paginationProps} />}
    </>
  );
};

export default ProductGrid;
