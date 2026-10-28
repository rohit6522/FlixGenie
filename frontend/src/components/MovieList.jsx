import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

function MovieList({ title, movies, onMovieClick, ranked = false }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!movies || movies.length === 0) return null;

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
    <div className="px-6 md:px-12 mb-8 group/row relative select-none">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-gradient-to-b from-red-500 to-rose-600 rounded-full" />
          <h2 className="text-white text-lg md:text-xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Left Scroll Navigation Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-3 top-[56%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 -ml-0.5" />
        </button>
      )}

      {/* Right Scroll Navigation Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-3 top-[56%] -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 items-center justify-center shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 hidden md:flex hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6 ml-0.5" />
        </button>
      )}

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth py-3 px-1 -mx-1"
      >
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            onClick={onMovieClick}
            rank={ranked ? index + 1 : undefined}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieList;
