import { useRef } from "react";

function CategoryTabs({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group px-8 mb-6">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
      >
        ◀
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-scroll scrollbar-hide border-b border-gray-800 scroll-smooth"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={`px-1 pb-2 text-sm md:text-base font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeCategory === cat.key
                ? "text-white border-red-600"
                : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black text-white w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center"
      >
        ▶
      </button>
    </div>
  );
}

export default CategoryTabs;