import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react";

function Top10Row({ title, movies, onMovieClick }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="px-6 md:px-12 mb-10 group/row relative select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
          <Trophy className="w-4 h-4" />
        </div>
        <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
          {title}
        </h2>
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-3 top-[56%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 -ml-0.5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-3 top-[56%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/85 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 ml-0.5" />
        </button>
      )}

      {/* Row items */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-1"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.imdbID}
            onClick={() => onMovieClick(movie)}
            className="flex-shrink-0 flex items-end cursor-pointer group/topitem transition-transform duration-300 hover:scale-105"
          >
            {/* Massive Stylized Number */}
            <span
              className="text-[130px] md:text-[220px] font-black leading-[0.78] -mr-5 md:-mr-8 select-none tracking-[-0.09em] transition-colors duration-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
              style={{
                color: "#141414",
                WebkitTextStroke: "3px #444444",
              }}
            >
              {index + 1}
            </span>

            {/* Poster Card */}
            <div className="relative w-28 md:w-44 aspect-[2/3] rounded-xl overflow-hidden bg-[#181818] border border-neutral-800 group-hover/topitem:border-red-600 shadow-xl transition-all duration-300">
              <img
                src={movie.Poster}
                alt={movie.Title}
                loading="lazy"
                className="w-full h-full object-cover group-hover/topitem:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-red-600 text-white font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-md shadow">
                F
              </span>
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md uppercase tracking-wider">
                TOP 10
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10Row;
