import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Film, Tv, Sparkles, ArrowRight, Loader2 } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const popularSearches = [
  "Inception",
  "Batman",
  "Avengers",
  "Dune",
  "Interstellar",
  "Money Heist",
  "Breaking Bad",
  "Stranger Things",
];

function NavSearch({ onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [opening, setOpening] = useState(null);

  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced live search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/omdb/find`, { params: { q } });
        if (!cancelled) setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error.message);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) {
          setSearched(true);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Esc closes, click outside closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  const openResult = async (item) => {
    if (opening) return;
    setOpening(item.imdbID);
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/omdb/details`, {
        params: { id: item.imdbID },
      });
      if (data && data.Response !== "False") {
        onSelect(data);
        onClose();
        return;
      }
    } catch (error) {
      console.error("Details error:", error.message);
    }
    setOpening(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results[0]) openResult(results[0]);
  };

  const hasPoster = (p) => p && p !== "N/A";

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-3xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 h-12 px-4 rounded-xl bg-[#121218]/90 border border-white/15 focus-within:border-red-500/80 focus-within:ring-2 focus-within:ring-red-500/20 shadow-2xl backdrop-blur-xl transition-all"
      >
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0 group-focus-within:text-red-500" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, TV shows, actors..."
          className="flex-1 bg-transparent text-white text-sm md:text-base outline-none placeholder-gray-500"
        />

        {loading && (
          <Loader2 className="w-4 h-4 text-red-500 animate-spin flex-shrink-0" />
        )}

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-2 py-1 rounded transition-colors"
        >
          ESC
        </button>
      </form>

      {/* Floating Results Panel */}
      <div className="absolute left-0 right-0 top-full mt-2.5 bg-[#0e0e14]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-[72vh] overflow-y-auto scrollbar-thin overflow-hidden z-50">
        {query.trim().length < 2 && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 text-gray-300 hover:text-white text-xs md:text-sm px-3.5 py-1.5 rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[11px] text-gray-300">/</kbd> anytime to open search</span>
              <span>Powered by OMDb API</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {results.length > 0 && (
            <div className="py-2">
              {results.map((item) => (
                <button
                  key={item.imdbID}
                  onClick={() => openResult(item)}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 text-left hover:bg-white/10 transition-colors group border-b border-white/[0.04] last:border-none"
                >
                  {hasPoster(item.Poster) ? (
                    <img
                      src={item.Poster}
                      alt={item.Title}
                      className="w-11 h-16 object-cover rounded-lg flex-shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-11 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0">
                      {item.Type === "series" ? <Tv className="w-5 h-5" /> : <Film className="w-5 h-5" />}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-red-400 transition-colors">
                      {item.Title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="text-gray-300 font-medium">{item.Year}</span>
                      <span>•</span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-white/5 text-[11px]">
                        {item.Type === "series" ? "TV Series" : "Movie"}
                      </span>
                    </div>
                  </div>

                  {opening === item.imdbID ? (
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin flex-shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {searched && !loading && results.length === 0 && query.trim().length >= 2 && (
          <div className="p-8 text-center text-gray-400">
            <Film className="w-8 h-8 mx-auto text-gray-600 mb-2" />
            <p className="text-sm">No results found for <span className="text-white font-medium">"{query.trim()}"</span></p>
            <p className="text-xs text-gray-500 mt-1">Try checking the spelling or searching for a different title.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default NavSearch;
