function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
    <div className="flex gap-3 px-8 mb-6 overflow-x-scroll scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
            activeCategory === cat.key
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;