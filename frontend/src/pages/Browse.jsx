import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieList from "../components/MovieList";
import GptSearch from "../components/GptSearch";
import GptResult from "../components/GptResult";
import { useMovies } from "../hooks/useMovies";
import { trendingTitles, popularTitles, topRatedTitles } from "../utils/movieLists";

function Browse() {
  const [gptResult, setGptResult] = useState("");

  const { movies: trending, loading: loading1 } = useMovies(trendingTitles);
  const { movies: popular, loading: loading2 } = useMovies(popularTitles);
  const { movies: topRated, loading: loading3 } = useMovies(topRatedTitles);

  const isLoading = loading1 || loading2 || loading3;

  return (
    <div className="bg-black min-h-screen pt-24 pb-10">
      <Navbar />

      <GptSearch onResult={setGptResult} />
      <GptResult result={gptResult} />

      {isLoading ? (
        <p className="text-white text-center mt-20">Loading movies...</p>
      ) : (
        <>
          <MovieList title="Trending Now" movies={trending} />
          <MovieList title="Popular on FlixGenie" movies={popular} />
          <MovieList title="Top Rated" movies={topRated} />
        </>
      )}
    </div>
  );
}

export default Browse;