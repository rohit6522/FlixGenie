import { useRef } from "react";

function Top10Row({ title, movies, onMovieClick }) {
  const scrollRef = useRef(null);
  if (!movies || movies.length === 0) return null;

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -600 : 600,
      behavior: "smooth",
    });
  };

  return (
    <div className="px-8 mb-10 group relative">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-3 px-1">{title}</h2>

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-[55%] -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        ◀
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-[55%] -translate-y-1/2 z-10 bg-black/60 hover:bg-black/90 text-white w-10 h-10 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        ▶
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth py-2">
        {movies.map((movie, index) => (
          <div
            key={movie.imdbID}
            onClick={() => onMovieClick(movie)}
            className="flex-shrink-0 flex items-end cursor-pointer transition-transform hover:scale-105"
          >
            <span
              className="text-[130px] md:text-[170px] font-black leading-none -mr-5 md:-mr-8 select-none"
              style={{ color: "#0a0a0a", WebkitTextStroke: "3px #6b6b6b" }}
            >
              {index + 1}
            </span>
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="relative w-28 md:w-36 aspect-[2/3] object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top10Row;