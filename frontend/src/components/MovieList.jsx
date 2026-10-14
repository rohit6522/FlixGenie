import { useRef } from "react";
import MovieCard from "./MovieCard";

function MovieList({ title, movies, onMovieClick, ranked = false }) {
  const scrollRef = useRef(null);

  if (!movies || movies.length === 0) return null;

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-8 mb-6 group/row relative">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-1 px-1">{title}</h2>

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-[55%] -translate-y-1/2 z-30 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex"
      >
        ◀
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-[55%] -translate-y-1/2 z-30 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity hidden md:flex"
      >
        ▶
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth py-4"
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