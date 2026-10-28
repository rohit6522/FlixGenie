import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Search, Film, Sparkles, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import SkeletonCard from "../components/SkeletonCard";
import { getWatchlist } from "../firebase/watchlistService";

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "movie", "series"
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      try {
        const list = await getWatchlist(user.uid);
        setMovies(list || []);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [user]);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchSearch =
        m.Title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.Genre?.toLowerCase().includes(searchFilter.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === "movie") return m.Type !== "series";
      if (activeTab === "series") return m.Type === "series";
      return true;
    });
  }, [movies, searchFilter, activeTab]);

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="pt-28 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto"
      >
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 shadow-md">
                <Bookmark className="w-5 h-5 fill-red-500/30" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                My Watchlist
              </h1>
              {!loading && movies.length > 0 && (
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-gray-300">
                  {movies.length} {movies.length === 1 ? "title" : "titles"}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Your saved cinematic queue synced with Firebase Cloud
            </p>
          </div>

          {/* Quick Search & Filters */}
          {!loading && movies.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter your list..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10 w-full sm:w-auto justify-center">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "all"
                      ? "bg-red-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("movie")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "movie"
                      ? "bg-red-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setActiveTab("series")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "series"
                      ? "bg-red-600 text-white shadow"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  Series
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-5 shadow-2xl">
              <Film className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Your watchlist is waiting</h2>
            <p className="text-gray-400 text-sm max-w-md mb-8">
              Explore thousands of blockbusters, trending TV series, and classic cinema. Click the + button on any title to add it here.
            </p>
            <Link
              to="/browse"
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-950 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore FlixGenie Discoveries</span>
            </Link>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-base font-semibold">No titles match your filter.</p>
            <button
              onClick={() => {
                setSearchFilter("");
                setActiveTab("all");
              }}
              className="text-xs text-red-400 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.imdbID} className="flex justify-center">
                <MovieCard movie={movie} onClick={setSelectedMovie} />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
      />
    </div>
  );
}

export default Watchlist;
