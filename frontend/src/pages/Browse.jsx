import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieList from "../components/MovieList";
import GptSearch from "../components/GptSearch";
import GptResult from "../components/GptResult";
import HeroBanner from "../components/HeroBanner";
import MovieModal from "../components/MovieModal";
import SearchBar from "../components/SearchBar";
import { useMovies } from "../hooks/useMovies";
import { trendingTitles, popularTitles, topRatedTitles } from "../utils/movieLists";
import { useTranslation } from "react-i18next";

function Browse() {
  const [gptResult, setGptResult] = useState("");
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { movies: trending, loading: loading1 } = useMovies(trendingTitles);
  const { movies: popular, loading: loading2 } = useMovies(popularTitles);
  const { movies: topRated, loading: loading3 } = useMovies(topRatedTitles);
  const { t } = useTranslation();
  const isLoading = loading1 || loading2 || loading3;

  useEffect(() => {
    if (trending.length > 0 && !featuredMovie) {
      const randomIndex = Math.floor(Math.random() * trending.length);
      setFeaturedMovie(trending[randomIndex]);
    }
  }, [trending, featuredMovie]);

  return (
    <div className="bg-black min-h-screen pb-10">
      <Navbar />

      {isLoading ? (
        <p className="text-white text-center pt-40">Loading movies...</p>
      ) : (
        <>
          <HeroBanner movie={featuredMovie} />

          <div className="px-8">
            <SearchBar onSelectMovie={setSelectedMovie} />
            <GptSearch onResult={setGptResult} />
            <GptResult result={gptResult} />
          </div>

          <MovieList title={t("trendingNow")} movies={trending} onMovieClick={setSelectedMovie} />
          <MovieList title={t("popular")} movies={popular} onMovieClick={setSelectedMovie} />
          <MovieList title={t("topRated")} movies={topRated} onMovieClick={setSelectedMovie} />
        </>
      )}

      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}

export default Browse;