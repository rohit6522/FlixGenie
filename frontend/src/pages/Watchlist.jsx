import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import SkeletonCard from "../components/SkeletonCard";
import { getWatchlist } from "../firebase/watchlistService";
import { Link } from "react-router-dom";
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
    <div className="bg-black min-h-screen pt-24 pb-10 px-8">
      <Navbar />
      <h1 className="text-white text-3xl font-bold mb-6">My Watchlist</h1>

      {loading ? (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">🎬</span>
          <p className="text-gray-400 mb-4">No movies in your watchlist yet.</p>
          <Link
            to="/browse"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold text-sm"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} onClick={setSelectedMovie} />
          ))}
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
      />
    </div>
  );
}

export default Watchlist;