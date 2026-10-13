import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import SkeletonCard from "../components/SkeletonCard";
import { getWatchlist } from "../firebase/watchlistService";

function Watchlist() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const user = useSelector((store) => store.user);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      const list = await getWatchlist(user.uid);
      setMovies(list);
      setLoading(false);
    };
    fetchWatchlist();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="pt-28 pb-16 px-6 md:px-12"
      >
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">My List</h1>
          {!loading && movies.length > 0 && (
            <span className="text-gray-400 text-sm">
              {movies.length} {movies.length === 1 ? "title" : "titles"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🎬</span>
            <p className="text-gray-400 mb-6">Your list is empty. Add titles to watch them later.</p>
            <Link
              to="/browse"
              className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded font-semibold text-sm"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-6">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} onClick={setSelectedMovie} />
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