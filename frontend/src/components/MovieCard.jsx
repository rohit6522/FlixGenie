import { motion } from "framer-motion";

function MovieCard({ movie, onClick }) {
  if (!movie.Poster || movie.Poster === "N/A") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08, zIndex: 10 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick(movie)}
      className="min-w-[160px] w-40 mr-4 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg group">
        <img
          src={movie.Poster}
          alt={movie.Title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x445?text=No+Poster";
          }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {movie.imdbRating && movie.imdbRating !== "N/A" && (
          <span className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-semibold px-2 py-1 rounded">
            ⭐ {movie.imdbRating}
          </span>
        )}
      </div>
      <p className="text-white text-sm mt-1 truncate">{movie.Title}</p>
    </motion.div>
  );
}

export default MovieCard;