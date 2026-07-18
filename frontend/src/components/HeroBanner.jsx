function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[70vh] mb-8">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.Poster})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-16 left-8 max-w-xl">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
          {movie.Title}
        </h1>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-4">
          {movie.Plot}
        </p>
        <div className="flex gap-3">
          <span className="text-green-400 font-semibold">
            ⭐ {movie.imdbRating}/10
          </span>
          <span className="text-gray-400">{movie.Year}</span>
          <span className="text-gray-400">{movie.Runtime}</span>
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;