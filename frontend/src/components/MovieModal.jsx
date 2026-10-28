import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Clapperboard,
  Users,
  Trophy,
  Gift,
  Film,
  Sparkles,
} from "lucide-react";
import { addToWatchlist, removeFromWatchlist, getWatchlist } from "../firebase/watchlistService";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function MovieModal({ movie, onClose, onSelectMovie, autoPlay }) {
  const [trailerId, setTrailerId] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showFullMovie, setShowFullMovie] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (!movie) {
      setTrailerId(null);
      setShowTrailer(false);
      setShowFullMovie(false);
      setSimilarMovies([]);
      return;
    }

    const fetchTrailer = async () => {
      setLoadingTrailer(true);
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/youtube/trailer`, {
          params: { title: movie.Title },
        });
        setTrailerId(data.videoId);
        if (autoPlay && data.videoId) setShowTrailer(true);
      } catch (error) {
        console.error("Trailer fetch error:", error.message);
      } finally {
        setLoadingTrailer(false);
      }
    };

    const checkWatchlist = async () => {
      if (!user) return;
      try {
        const list = await getWatchlist(user.uid);
        setInWatchlist(list.some((m) => m.imdbID === movie.imdbID));
      } catch (err) {
        console.error("Watchlist check error:", err.message);
      }
    };

    const fetchSimilarMovies = async () => {
      setLoadingSimilar(true);
      setSimilarMovies([]);
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/similar-movies`, {
          title: movie.Title,
          genre: movie.Genre,
        });

        if (data.titles && data.titles.length > 0) {
          const { data: bulkData } = await axios.post(`${BACKEND_URL}/api/omdb/bulk`, {
            titles: data.titles,
          });
          setSimilarMovies(bulkData.results || []);
        }
      } catch (error) {
        console.error("Similar movies error:", error.message);
      } finally {
        setLoadingSimilar(false);
      }
    };

    setShowTrailer(false);
    setShowFullMovie(false);
    fetchTrailer();
    checkWatchlist();
    fetchSimilarMovies();
  }, [movie, user, autoPlay]);

  if (!movie) return null;

  const handleWatchlistToggle = async () => {
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

  const genres = movie.Genre
    ? movie.Genre.split(",").map((g) => g.trim())
    : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#0d0d14] border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl shadow-black"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Floating Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Media Header / Video Player or Backdrop */}
          <div className="relative w-full aspect-video max-h-[380px] bg-black overflow-hidden">
            {showFullMovie && movie.archiveId ? (
              <iframe
                className="w-full h-full"
                src={`https://archive.org/embed/${movie.archiveId}`}
                title="Full Movie"
                allowFullScreen
              />
            ) : showTrailer && trailerId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-full object-cover blur-md scale-105 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/40 to-black/60" />
                
                {/* Floating Play Button on top of thumbnail */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  {trailerId && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-600/50 hover:scale-110 active:scale-95 transition-all group"
                    >
                      <Play className="w-7 h-7 fill-white ml-1 group-hover:scale-105 transition-transform" />
                    </button>
                  )}
                  {loadingTrailer && (
                    <span className="text-xs text-gray-300 font-medium bg-black/60 px-3 py-1 rounded-full border border-white/10">
                      Searching for trailer...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Details Content Area */}
          <div className="p-6 md:p-8">
            {/* Title and Top Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {movie.Title}
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-gray-300">
                  {movie.imdbRating && movie.imdbRating !== "N/A" && (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      {movie.imdbRating}/10
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-200 font-medium">
                    {movie.Year}
                  </span>
                  {movie.Runtime && movie.Runtime !== "N/A" && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      {movie.Runtime}
                    </span>
                  )}
                  {movie.Rated && movie.Rated !== "N/A" && (
                    <span className="border border-white/20 px-1.5 py-0.2 rounded text-[11px] uppercase">
                      {movie.Rated}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
                {movie.archiveId && !showFullMovie && (
                  <button
                    onClick={() => setShowFullMovie(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-950 transition-all"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Watch Full Movie</span>
                  </button>
                )}

                {!showTrailer && trailerId && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-red-950 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all border disabled:opacity-50 active:scale-95 ${
                    inWatchlist
                      ? "bg-white/20 border-white/30 text-white hover:bg-white/30"
                      : "bg-white/10 border-white/15 text-white hover:bg-white/20"
                  }`}
                >
                  {inWatchlist ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to List</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Genres Tag Row */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="text-xs text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Plot Synopsis */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              {movie.Plot}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 mb-6">
              {movie.Director && movie.Director !== "N/A" && (
                <div className="flex items-start gap-2">
                  <Clapperboard className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Director</span>
                    <span className="text-white font-medium">{movie.Director}</span>
                  </div>
                </div>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Cast</span>
                    <span className="text-white font-medium">{movie.Actors}</span>
                  </div>
                </div>
              )}

              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="sm:col-span-2 flex items-start gap-2 pt-2 border-t border-white/5">
                  <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Accolades</span>
                    <span className="text-gray-200">{movie.Awards}</span>
                  </div>
                </div>
              )}
            </div>

            {/* AI Powered "More Like This" Section */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-red-400" />
                <h3 className="text-white text-base font-bold tracking-tight">
                  More Like This
                </h3>
              </div>

              {loadingSimilar ? (
                <div className="flex gap-3 overflow-x-hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="min-w-[120px] w-32 shimmer aspect-[2/3] rounded-xl" />
                  ))}
                </div>
              ) : similarMovies.length > 0 ? (
                <div className="flex gap-3.5 overflow-x-auto scrollbar-thin pb-2">
                  {similarMovies.map((sm) => (
                    <div
                      key={sm.imdbID}
                      onClick={() => onSelectMovie && onSelectMovie(sm)}
                      className="min-w-[125px] w-32 cursor-pointer group flex-shrink-0 transition-all duration-200 hover:scale-105"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-500/50 relative shadow-md">
                        {sm.Poster && sm.Poster !== "N/A" ? (
                          <img
                            src={sm.Poster}
                            alt={sm.Title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <Film className="w-6 h-6" />
                          </div>
                        )}
                        {sm.imdbRating && sm.imdbRating !== "N/A" && (
                          <span className="absolute top-1.5 right-1.5 bg-black/75 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-bold">
                            ★ {sm.imdbRating}
                          </span>
                        )}
                      </div>
                      <p className="text-white text-xs font-semibold mt-1.5 truncate group-hover:text-red-400 transition-colors">
                        {sm.Title}
                      </p>
                      <p className="text-gray-400 text-[10px]">{sm.Year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No similar movies found.</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MovieModal;
