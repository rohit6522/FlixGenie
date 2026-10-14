import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../firebase/watchlistService";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#1f1f1f'/><text x='50%' y='50%' fill='#6b7280' font-family='sans-serif' font-size='18' text-anchor='middle'>No Poster</text></svg>"
  );

const hasValue = (v) => v && v !== "N/A";

function MovieCard({ movie, onClick, rank }) {
  const user = useSelector((store) => store.user);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!hasValue(movie.Poster)) return null;

  const year = parseInt(movie.Year, 10);
  const isNew = !Number.isNaN(year) && year >= new Date().getFullYear() - 2;

  const match = hasValue(movie.imdbRating)
    ? Math.round(parseFloat(movie.imdbRating) * 10)
    : null;

  const genres = hasValue(movie.Genre)
    ? movie.Genre.split(",").slice(0, 3).map((g) => g.trim())
    : [];

  const toggleList = async (e) => {
    e.stopPropagation();
    if (!user || busy) return;
    setBusy(true);
    try {
      if (added) {
        await removeFromWatchlist(user.uid, movie.imdbID);
        setAdded(false);
      } else {
        await addToWatchlist(user.uid, movie);
        setAdded(true);
      }
    } catch (error) {
      console.error("Watchlist error:", error.message);
    } finally {
      setBusy(false);
    }
  };

  const open = (e) => {
    e.stopPropagation();
    onClick(movie);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.06, zIndex: 20 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(movie)}
      className="group/card relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[185px] mr-3 cursor-pointer"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#1f1f1f] ring-1 ring-white/5 group-hover/card:ring-white/30 transition">
        {/* Poster */}
        <img
          src={movie.Poster}
          alt={movie.Title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK;
            setLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {!loaded && (
          <div className="absolute inset-0">
            <div className="shimmer w-full h-full" />
          </div>
        )}

        {/* Top-left: rank number (Apple style) or red F badge (Netflix style) */}
        {rank ? (
          <span className="absolute top-2 left-2.5 text-white text-2xl font-extrabold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {rank}
          </span>
        ) : (
          <span className="absolute top-0 left-2 bg-[#e50914] text-white font-black text-[11px] w-4 h-5 flex items-center justify-center rounded-b-sm shadow">
            F
          </span>
        )}

        {/* Top-right: FREE badge for public domain films */}
        {movie.archiveId && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            FREE
          </span>
        )}

        {/* Resting bottom label (hidden on hover) */}
        {(rank || isNew) && (
          <div className="absolute inset-x-0 bottom-0 pt-8 pb-2 bg-gradient-to-t from-black/85 to-transparent flex justify-center group-hover/card:opacity-0 transition-opacity">
            {rank ? (
              <span className="text-gray-300 text-[11px]">{genres[0]}</span>
            ) : (
              <span className="bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                Recently added
              </span>
            )}
          </div>
        )}

        {/* Hover info panel */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={open}
              aria-label="Play"
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <button
              onClick={toggleList}
              disabled={busy}
              aria-label="Add to My List"
              className="w-8 h-8 rounded-full border-2 border-gray-400 hover:border-white text-white flex items-center justify-center text-base leading-none transition-colors disabled:opacity-50"
            >
              {added ? "✓" : "+"}
            </button>

            <button
              onClick={open}
              aria-label="More info"
              className="ml-auto w-8 h-8 rounded-full border-2 border-gray-400 hover:border-white text-white flex items-center justify-center transition-colors"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <p className="text-white text-sm font-bold leading-tight line-clamp-2">
            {movie.Title}
          </p>

          <div className="flex items-center gap-2 text-[11px]">
            {match && <span className="text-green-400 font-bold">{match}% Match</span>}
            {hasValue(movie.Rated) && (
              <span className="border border-gray-400 text-gray-300 px-1">{movie.Rated}</span>
            )}
            <span className="text-gray-300">{movie.Year}</span>
          </div>

          {genres.length > 0 && (
            <p className="text-gray-300 text-[11px] truncate">{genres.join(" • ")}</p>
          )}
        </div>
      </div>

      {/* Mobile has no hover, so show the title below the card */}
      <p className="md:hidden text-white text-xs mt-1.5 truncate">{movie.Title}</p>
    </motion.div>
  );
}

export default MovieCard;