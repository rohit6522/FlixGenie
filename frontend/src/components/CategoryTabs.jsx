function CategoryTabs({ categories, activeCategory, onSelect }) {
  return (
   <div className="flex gap-6 px-8 mb-6 overflow-x-scroll scrollbar-hide border-b border-gray-800">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-1 pb-2 text-sm md:text-base font-semibold whitespace-nowrap transition-colors border-b-2 ${activeCategory === cat.key
              ? "text-white border-red-600"
              : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;