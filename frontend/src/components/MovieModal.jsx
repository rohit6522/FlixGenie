import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "../firebase/watchlistService";

const BACKEND_URL = "http://localhost:5000";

function MovieModal({ movie, onClose }) {
  const [trailerId, setTrailerId] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!movie) {
      setTrailerId(null);
      setShowTrailer(false);
      return;
    }

    const fetchTrailer = async () => {
      setLoadingTrailer(true);
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/youtube/trailer`, {
          params: { title: movie.Title },
        });
        setTrailerId(data.videoId);
      } catch (error) {
        console.error("Trailer fetch error:", error.message);
      } finally {
        setLoadingTrailer(false);
      }
    };

    const checkWatchlist = async () => {
      if (!user) return;
      const list = await getWatchlist(user.uid);
      setInWatchlist(list.some((m) => m.imdbID === movie.imdbID));
    };

    fetchTrailer();
    checkWatchlist();
  }, [movie, user]);

  if (!movie) return null;

  const handleWatchlistToggle = async () => {
    console.log("Button clicked!");
    if (!user) return;
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(user.uid, movie.imdbID);
        setInWatchlist(false);
      } else {
        await addToWatchlist(user.uid, movie);
        setInWatchlist(true);
      }
    } catch (error) {
      console.error("Watchlist error:", error.message);
    } finally {
      setWatchlistLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {showTrailer && trailerId ? (
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-t-lg"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-72 object-cover rounded-t-lg"
            />
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center z-10"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <h2 className="text-white text-2xl font-bold">{movie.Title}</h2>
            <div className="flex gap-2">
              {!showTrailer && trailerId && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
                >
                  ▶ Play Trailer
                </button>
              )}
              <button
                onClick={handleWatchlistToggle}
                
                disabled={watchlistLoading}
                className={`px-4 py-2 rounded font-semibold text-sm disabled:opacity-50 ${
                  inWatchlist
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-white hover:bg-gray-200 text-black"
                }`}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>

          {loadingTrailer && (
            <p className="text-gray-400 text-sm mb-2">Loading trailer...</p>
          )}

          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <span className="text-green-400 font-semibold">⭐ {movie.imdbRating}/10</span>
            <span className="text-gray-400">{movie.Year}</span>
            <span className="text-gray-400">{movie.Runtime}</span>
            <span className="text-gray-400 border border-gray-600 px-2 rounded">{movie.Rated}</span>
          </div>

          <p className="text-gray-300 mb-4">{movie.Plot}</p>

          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Genre:</span> <span className="text-white">{movie.Genre}</span></p>
            <p><span className="text-gray-500">Director:</span> <span className="text-white">{movie.Director}</span></p>
            <p><span className="text-gray-500">Actors:</span> <span className="text-white">{movie.Actors}</span></p>
            <p><span className="text-gray-500">Awards:</span> <span className="text-white">{movie.Awards}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;