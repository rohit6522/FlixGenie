import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const popularSearches = ["Inception", "Batman", "Avengers", "Dune", "Interstellar", "Money Heist"];

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
    }, 450);

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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative w-full max-w-3xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 h-11 px-4 bg-black/80 border border-gray-500 focus-within:border-white rounded-md transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400 flex-shrink-0">
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies and TV shows..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />

        {loading && (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </form>

      {/* Dropdown */}
      <div className="absolute left-0 right-0 top-full mt-2 bg-[#141414] border border-gray-800 rounded-md shadow-2xl max-h-[70vh] overflow-y-auto">
        {query.trim().length < 2 && (
          <div className="p-4">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 text-sm px-3 py-1.5 rounded-full transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-4">Tip: press / anywhere to open search</p>
          </div>
        )}

        {results.map((item) => (
          <button
            key={item.imdbID}
            onClick={() => openResult(item)}
            className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
          >
            {hasPoster(item.Poster) ? (
              <img src={item.Poster} alt="" className="w-10 h-14 object-cover rounded flex-shrink-0" />
            ) : (
              <div className="w-10 h-14 rounded bg-[#1f1f1f] flex items-center justify-center text-gray-600 flex-shrink-0">
                🎬
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-semibold truncate">{item.Title}</p>
              <p className="text-gray-400 text-xs">
                {item.Year} · {item.Type === "series" ? "TV Series" : "Movie"}
              </p>
            </div>

            {opening === item.imdbID ? (
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            ) : (
              <span className="text-gray-500 text-xs flex-shrink-0">▶</span>
            )}
          </button>
        ))}

        {searched && !loading && results.length === 0 && query.trim().length >= 2 && (
          <p className="p-6 text-center text-gray-400 text-sm">
            No results for "{query.trim()}". Try a different title.
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default NavSearch;