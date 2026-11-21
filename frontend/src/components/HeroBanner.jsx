import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Play,
  Plus,
  Check,
  Info,
  Star,
  Clock,
  Sparkles,
  Film,
} from "lucide-react";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} from "../firebase/watchlistService";

// Ask Amazon's image service for a larger version of the poster
const hiRes = (url) =>
  url && url !== "N/A" ? url.replace(/_V1_.*\.jpg$/, "_V1_SX1200.jpg") : url;

function HeroBanner({ movie, onPlay, onSelect }) {
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
    ? movie.Genre.split(",").slice(0, 3).map((g) => g.trim())
    : [];

  return (
    <div className="relative w-full h-[88vh] min-h-[600px] max-h-[920px] overflow-hidden select-none bg-[#141414]">
      {/* Netflix Hero Billboard Backdrop */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={hiRes(movie.Poster)}
          alt={movie.Title}
          className="w-full h-full object-cover object-[center_20%] brightness-[0.75] transition-opacity duration-1000 scale-100"
        />
        {/* Netflix Vignette Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-transparent z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent z-[1]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent z-[1]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full max-w-[1680px] mx-auto px-6 md:px-12 pt-20 pb-36 flex items-center justify-between gap-12">
        <motion.div
          key={movie.imdbID + "-text"}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl lg:max-w-3xl"
        >
          {/* Top highlight pill */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Premiere
            </span>
            {movie.archiveId && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                100% Free Full Movie
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white mb-5 drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            {movie.Title}
          </h1>

          {/* Meta Information Badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm mb-4">
            {match && (
              <span className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                <Star className="w-3 h-3 fill-emerald-400" />
                {match}% Match
              </span>
            )}
            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <span className="text-yellow-400 font-bold flex items-center gap-1 bg-yellow-950/40 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                ★ {movie.imdbRating}
              </span>
            )}
            <span className="text-gray-300 font-medium px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
              {movie.Year}
            </span>
            {movie.Rated && movie.Rated !== "N/A" && (
              <span className="border border-white/20 text-gray-300 px-2 py-0.5 rounded-md text-xs font-semibold uppercase">
                {movie.Rated}
              </span>
            )}
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <span className="text-gray-300 flex items-center gap-1 text-xs">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {movie.Runtime}
              </span>
            )}
            <span className="px-1.5 py-0.5 bg-red-950/60 text-red-300 text-[10px] font-bold tracking-wider rounded border border-red-800/40 uppercase">
              Ultra HD
            </span>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {genres.map((g) => (
                <span
                  key={g}
                  className="text-xs text-gray-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-3 mb-8 max-w-2xl text-shadow">
            {movie.Plot}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onPlay && onPlay(movie)}
              className="bg-red-600 hover:bg-red-500 active:scale-95 text-white px-7 py-3.5 rounded-xl font-bold flex items-center gap-2.5 transition-all shadow-xl shadow-red-600/30 group"
            >
              <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={toggleList}
              disabled={busy}
              className={`px-6 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all border backdrop-blur-md active:scale-95 disabled:opacity-60 ${
                inList
                  ? "bg-white/20 border-white/40 text-white hover:bg-white/30"
                  : "bg-white/10 hover:bg-white/15 border-white/15 text-white hover:border-white/30"
              }`}
            >
              {inList ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add to List</span>
                </>
              )}
            </button>

            {onSelect && (
              <button
                onClick={() => onSelect(movie)}
                className="px-5 py-3.5 rounded-xl font-semibold flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-gray-200 hover:text-white transition-all backdrop-blur-md active:scale-95"
              >
                <Info className="w-5 h-5 text-gray-300" />
                <span>More Info</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Sharp High-Res Poster Showcase on Desktop */}
        <motion.div
          key={movie.imdbID + "-poster"}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:block flex-shrink-0 relative group"
        >
          <div className="relative rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl shadow-black">
            <img
              src={hiRes(movie.Poster)}
              alt={movie.Title}
              onError={(e) => {
                if (e.target.src !== movie.Poster) e.target.src = movie.Poster;
              }}
              className="h-[360px] lg:h-[460px] w-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-red-500" />
                Click More Info for details & cast
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroBanner;
