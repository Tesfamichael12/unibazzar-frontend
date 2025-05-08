import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import ReviewSection from "../components/review/ReviewSection";

const ProductDetail = () => {
  const { type: rawType, id } = useParams();
  const type = rawType || "merchant";
  console.log("ProductDetail type param:", type, "id:", id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://127.0.0.1:8000/api/products/merchant-products/${id}/`)
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          let errorMsg = `Product not found (status ${res.status})`;
          if (contentType && contentType.includes("application/json")) {
            const errJson = await res.json().catch(() => null);
            if (errJson && errJson.detail) errorMsg = errJson.detail;
          }
          throw new Error(errorMsg);
        }
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Unexpected response from server. Please try again later."
          );
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
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
    return (
      <section className="pt-24 py-12 px-4 bg-gray-50 dark:bg-gray-900 min-h-[80vh]">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <img
              src={product.photo}
              alt={product.name}
              className="rounded-lg w-full max-h-96 object-contain shadow-md border border-blue-100 dark:border-gray-700"
            />
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full mr-2">
                  Category: {product.category?.name}
                </span>
                {product.tags && (
                  <span className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1 rounded-full">
                    Tags: {product.tags}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ETB {product.price}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Contact: {product.phone_number}
                </span>
              </div>
              {product.nearest_university && (
                <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  Nearest University: {product.nearest_university}
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer">
                Add to Cart
              </button>
              <Link
                to="/listings"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
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
