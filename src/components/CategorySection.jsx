import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Products",
    description:
      "Browse and purchase a wide variety of items from students and campus sellers.",
    image:
      "https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 2,
    name: "Textbooks,Notes & Study Guides",
    description: "Access high-quality notes and study materials from peers.",
    image:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 3,
    name: "Tutoring Services",
    description: "Find or offer tutoring for a variety of subjects.",
    image:
      "https://images.pexels.com/photos/4145197/pexels-photo-4145197.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: 4,
    name: "Services",
    description: "Discover and offer a variety of campus-related services.",
    image:
      "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl">
              Explore our campus-focused categories to find textbooks, notes,
              tutoring, and more from fellow students.
            </p>
          </div>
          <Link
            to="/listings"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/listings?category=${encodeURIComponent(category.name)}`}
              className="group relative overflow-hidden rounded-xl aspect-[0.9/1] block bg-white dark:bg-gray-800"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-200 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-white font-medium">
                  <span>Shop Now</span>
                  <ChevronRight
                    size={16}
                    className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/listings"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
