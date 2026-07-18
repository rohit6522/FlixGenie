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
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="rounded-lg w-full shadow-lg"
      />
      <p className="text-white text-sm mt-1 truncate">{movie.Title}</p>
    </motion.div>
  );
}

export default MovieCard;