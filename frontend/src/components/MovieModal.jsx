function MovieModal({ movie, onClose }) {
  if (!movie) return null;

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
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-full h-72 object-cover rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-white text-2xl font-bold mb-2">{movie.Title}</h2>

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