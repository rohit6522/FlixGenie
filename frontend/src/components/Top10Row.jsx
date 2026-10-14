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
    <div className="px-8 mb-8 group/row relative">
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
        className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth py-4"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.imdbID}
            onClick={() => onMovieClick(movie)}
            className="flex-shrink-0 flex items-end cursor-pointer transition-transform duration-200 hover:scale-105"
          >
            <span
              className="text-[150px] md:text-[250px] font-black leading-[0.8] -mr-6 md:-mr-10 select-none tracking-[-0.08em]"
              style={{ color: "#0a0a0a", WebkitTextStroke: "4px #595959" }}
            >
              {index + 1}
            </span>

            <div className="relative w-24 md:w-40 aspect-[2/3] rounded-md overflow-hidden bg-[#1f1f1f]">
              <img
                src={movie.Poster}
                alt={movie.Title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-0 left-2 bg-[#e50914] text-white font-black text-[11px] w-4 h-5 flex items-center justify-center rounded-b-sm">
                F
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#e50914] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">
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