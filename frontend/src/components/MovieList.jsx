import MovieCard from "./MovieCard";

function MovieList({ title, movies, onMovieClick }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-8 mb-8">
      <h2 className="text-white text-xl font-semibold mb-3">{title}</h2>
      <div className="flex overflow-x-scroll scrollbar-hide">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
}

export default MovieList;