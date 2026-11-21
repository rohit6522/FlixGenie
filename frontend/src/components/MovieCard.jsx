import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Play, Plus, Check, ChevronDown, Star, Gift } from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "../firebase/watchlistService";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><rect width='100%' height='100%' fill='#121218'/><text x='50%' y='50%' fill='#4b5563' font-family='sans-serif' font-size='16' text-anchor='middle'>No Poster</text></svg>"
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
    ? movie.Genre.split(",").slice(0, 2).map((g) => g.trim())
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
      whileHover={{ scale: 1.05, y: -4, zIndex: 25 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={() => onClick(movie)}
      className="group/card relative flex-shrink-0 w-[140px] sm:w-[165px] md:w-[190px] mr-3.5 cursor-pointer select-none"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#121218] border border-white/[0.08] group-hover/card:border-red-500/50 shadow-md group-hover/card:shadow-2xl group-hover/card:shadow-red-950/40 transition-all duration-300">
        {/* Poster Image */}
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
          className={`w-full h-full object-cover transition-all duration-500 group-hover/card:scale-105 ${loaded ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Shimmer Placeholder */}
        {!loaded && (
          <div className="absolute inset-0">
            <div className="shimmer w-full h-full" />
          </div>
        )}

        {/* Top-left: Rank or Brand Badge */}
        {rank ? (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-black italic">
              #{rank}
            </span>
          </div>
        ) : (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white text-[11px] font-black shadow-md border border-white/20">
            F
          </div>
        )}

        {/* Top-right: FREE or HD badge */}
        {movie.archiveId ? (
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
            <Gift className="w-2.5 h-2.5" />
            FREE
          </span>
        ) : match ? (
          <span className="absolute top-2 right-2 bg-black/75 backdrop-blur-md border border-white/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <Star className="w-2.5 h-2.5 fill-emerald-400" />
            {match}%
          </span>
        ) : null}

        {/* Resting Bottom Highlight for New / Ranked Titles */}
        {(rank || isNew) && (
          <div className="absolute inset-x-0 bottom-0 py-2 px-2 bg-black/80 flex justify-center group-hover/card:opacity-0 transition-opacity">
            {rank ? (
              <span className="text-gray-300 text-[10px] font-medium tracking-wide truncate">
                {genres[0] || "Top Rated"}
              </span>
            ) : (
              <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Recently Added
              </span>
            )}
          </div>
        )}

        {/* Cinematic Hover Overlay */}
        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3.5 gap-2">
          {/* Action Button Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={open}
              aria-label="Play"
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>

            <button
              onClick={toggleList}
              disabled={busy}
              aria-label="Add to Watchlist"
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 ${added
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-black/60 border-white/40 hover:border-white text-white hover:bg-white/20"
                }`}
            >
              {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={open}
              aria-label="More info"
              className="ml-auto w-8 h-8 rounded-full bg-black/60 border border-white/30 hover:border-white text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-95"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <p className="text-white text-xs sm:text-sm font-bold leading-tight line-clamp-2">
            {movie.Title}
          </p>

          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[10px] text-gray-300">
            {match && <span className="text-emerald-400 font-bold">{match}%</span>}
            {hasValue(movie.Rated) && (
              <span className="border border-white/20 px-1 py-0.2 rounded text-[9px] uppercase">
                {movie.Rated}
              </span>
            )}
            <span className="text-gray-400">{movie.Year}</span>
          </div>

          {/* Genre tags */}
          {genres.length > 0 && (
            <p className="text-gray-400 text-[10px] truncate">
              {genres.join(" • ")}
            </p>
          )}
        </div>
      </div>

      {/* Mobile Title Display */}
      <p className="md:hidden text-gray-200 text-xs mt-2 font-medium truncate">
        {movie.Title}
      </p>
    </motion.div>
  );
}

export default MovieCard;
