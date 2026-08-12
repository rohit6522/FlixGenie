import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieList({ title, movies, onMovieClick }) {
  const scrollRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="px-8 mb-8 group relative">
      <h2 className="text-white text-xl font-semibold mb-3">{title}</h2>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-[52%] -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-[52%] -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        ▶
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth"
      >
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
}

export default MovieList;