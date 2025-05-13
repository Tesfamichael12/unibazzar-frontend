function CategoryButtons({ categories, selectedCategory, onCategoryChange }) {
  // Add new static categories for consistency
  const staticCategories = [
    "Products",
    "Notes & Textbooks",
    "Tutoring",
    "Services",
    "Food",
  ];
  // Merge static and dynamic categories, avoiding duplicates
  const allCategories = [
    ...staticCategories,
    ...categories.filter(
      (cat) =>
        !staticCategories.some((s) => s.toLowerCase() === cat.toLowerCase())
    ),
  ];

  return (
    <div className="w-full flex justify-center mt-10">
      <div className="flex flex-wrap gap-2">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-full transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/60
              ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg animate-pulse-glow"
                  : "text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-400 hover:scale-105 hover:shadow-lg"
              }
              cursor-pointer group relative overflow-hidden`}
            style={{ position: "relative" }}
          >
            <span className="relative z-10">{cat}</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-400/10 blur-lg animate-pulse pointer-events-none"></span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryButtons;
