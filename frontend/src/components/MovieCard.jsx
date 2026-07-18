function MovieCard({ movie }) {
  if (!movie.Poster || movie.Poster === "N/A") return null;

  return (
    <div className="min-w-[160px] w-40 mr-4 cursor-pointer transition-transform hover:scale-105">
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="rounded-lg w-full"
      />
      <p className="text-white text-sm mt-1 truncate">{movie.Title}</p>
    </div>
  );
}

export default MovieCard;