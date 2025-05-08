import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, ShoppingBag, Heart } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice";
import { toggleFavorite } from "../redux/slices/favoriteSlice";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 299.99,
    image:
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight_FV1?wid=976&hei=916&fmt=jpeg&qlt=90",
    rating: 4.8,
    category: "Electronics",
    isNew: true,
  },
  {
    id: 2,
    name: "Calculus Textbook",
    price: 49.99,
    image:
      "https://images.pexels.com/photos/256369/pexels-photo-256369.jpeg?auto=compress&fit=crop&w=600&q=80",
    rating: 4.7,
    category: "Books",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 24.99,
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&fit=crop&w=600&q=80",
    rating: 4.9,
    category: "Accessories",
    isNew: true,
  },
  {
    id: 4,
    name: "Scientific Calculator",
    price: 19.99,
    image:
      "https://images.pexels.com/photos/220301/pexels-photo-220301.jpeg?auto=compress&fit=crop&w=600&q=80",
    rating: 4.6,
    category: "Electronics",
  },
];

const FeaturedProduct = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites);

  const isFavorite = (id) => favorites.includes(id);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Discover our most popular campus products, from electronics to
            textbooks and more.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to="/listings"
              className="group block h-full"
              style={{ textDecoration: "none" }}
            >
              <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-white dark:bg-gray-800 flex items-center justify-center">
                {product.isNew && (
                  <span className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                    New
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleFavorite(product.id));
                  }}
                  className={`absolute top-3 right-3 z-10 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer ${
                    isFavorite(product.id) ? "text-red-500 opacity-100" : ""
                  }`}
                  type="button"
                  aria-label="Mark as Read Later"
                >
                  <Heart
                    size={18}
                    fill={isFavorite(product.id) ? "red" : "none"}
                  />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg border-4 border-blue-100 dark:border-gray-700 shadow-lg mx-auto transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 py-3 px-4 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <button
                    className="w-full flex items-center justify-center space-x-2 bg-gray-900 dark:bg-blue-700 hover:bg-black dark:hover:bg-blue-800 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(
                        addToCart({
                          id: product.id,
                          title: product.name,
                          price: product.price,
                          imageUrl: product.image,
                        })
                      );
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                  {product.category}
                </span>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {product.rating}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} ETB
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/listings"
            className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
