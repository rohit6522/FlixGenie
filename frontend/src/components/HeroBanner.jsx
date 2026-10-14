import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../firebase/watchlistService";

// Ask Amazon's image service for a larger version of the poster
const hiRes = (url) =>
  url && url !== "N/A" ? url.replace(/_V1_.*\.jpg$/, "_V1_SX1000.jpg") : url;

function HeroBanner({ movie, onPlay }) {
  const user = useSelector((store) => store.user);
  const [inList, setInList] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setInList(false);

    const check = async () => {
      if (!user || !movie) return;
      try {
        const list = await getWatchlist(user.uid);
        if (!cancelled) setInList(list.some((m) => m.imdbID === movie.imdbID));
      } catch (error) {
        console.error("Watchlist check error:", error.message);
      }
    };
    check();

    return () => {
      cancelled = true;
    };
  }, [movie, user]);

  if (!movie) return null;

  const toggleList = async () => {
    if (!user || busy) return;
    setBusy(true);
    try {
      if (inList) {
        await removeFromWatchlist(user.uid, movie.imdbID);
        setInList(false);
      } else {
        await addToWatchlist(user.uid, movie);
        setInList(true);
      }
    } catch (error) {
      console.error("Watchlist error:", error.message);
    } finally {
      setBusy(false);
    }
  };

  const match =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? Math.round(parseFloat(movie.imdbRating) * 10)
      : null;

  const genres = movie.Genre
    ? movie.Genre.split(",").slice(0, 3).map((g) => g.trim()).join("  •  ")
    : "";

  return (
    <div className="relative w-full h-[85vh] min-h-[560px] overflow-hidden">
      {/* Blurred backdrop */}
      <img
        src={movie.Poster}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top blur-2xl scale-125 opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-8 pt-16 pb-32 flex items-center justify-between gap-10">
        <motion.div
          key={movie.imdbID + "-text"}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none mb-5 drop-shadow-2xl">
            {movie.Title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
            {match && <span className="text-green-400 font-bold">{match}% Match</span>}
            <span className="text-gray-300">{movie.Year}</span>
            {movie.Rated && movie.Rated !== "N/A" && (
              <span className="border border-gray-400 text-gray-300 px-1.5 text-xs">
                {movie.Rated}
              </span>
            )}
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <span className="text-gray-300">{movie.Runtime}</span>
            )}
          </div>

          {genres && <p className="text-gray-400 text-sm mb-3">{genres}</p>}

          <p className="text-gray-200 text-sm md:text-base line-clamp-3 mb-6 max-w-xl">
            {movie.Plot}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onPlay && onPlay(movie)}
              className="bg-[#e50914] hover:bg-[#c11119] text-white px-8 py-3 rounded font-semibold flex items-center gap-2 transition-colors"
            >
              ▶ Play
            </button>
            <button
              onClick={toggleList}
              disabled={busy}
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-6 py-3 rounded font-semibold flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {inList ? "✓ My List" : "+ My List"}
            </button>
          </div>
        </motion.div>

        {/* Sharp poster on the right (desktop) */}
        <motion.img
          key={movie.imdbID + "-poster"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={hiRes(movie.Poster)}
          alt={movie.Title}
          onError={(e) => {
            if (e.target.src !== movie.Poster) e.target.src = movie.Poster;
          }}
          className="hidden md:block h-[60%] max-h-[480px] rounded-md shadow-2xl shadow-black/80 lg:mr-16"
        />
      </div>
    </div>
  );
}

export default HeroBanner;