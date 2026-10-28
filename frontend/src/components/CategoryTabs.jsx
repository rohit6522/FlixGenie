import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CategoryTabs({ categories, activeCategory, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group px-6 md:px-12 mb-6 select-none">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 -ml-0.5" />
      </button>

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onSelect(cat.key)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 border border-red-500/50"
                  : "bg-white/[0.04] hover:bg-white/[0.09] text-gray-300 hover:text-white border border-white/10"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center shadow-lg"
      >
        <ChevronRight className="w-4 h-4 ml-0.5" />
      </button>
    </div>
  );
}

export default CategoryTabs;
