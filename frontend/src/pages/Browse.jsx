import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import MovieList from "../components/MovieList";
import GptSearch from "../components/GptSearch";
import GptResult from "../components/GptResult";
import HeroBanner from "../components/HeroBanner";
import MovieModal from "../components/MovieModal";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import SkeletonRow from "../components/SkeletonRow";
import SkeletonHero from "../components/SkeletonHero";
import { useMovies } from "../hooks/useMovies";
import { usePublicDomainMovies } from "../hooks/usePublicDomainMovies";
import {
  trendingTitles,
  popularTitles,
  topRatedTitles,
  hollywoodTitles,
  southMovieTitles,
  webSeriesTitles,
} from "../utils/movieLists";

const categories = [
  { key: "hollywood", label: "🎬 Hollywood", titles: hollywoodTitles },
  { key: "south", label: "🎭 South Movies", titles: southMovieTitles },
  { key: "webseries", label: "📺 Web Series", titles: webSeriesTitles },
];

function Browse() {
  const { t } = useTranslation();
  const [gptResult, setGptResult] = useState("");
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState("hollywood");

  const { movies: trending, loading: loading1 } = useMovies(trendingTitles);
  const { movies: popular, loading: loading2 } = useMovies(popularTitles);
  const { movies: topRated, loading: loading3 } = useMovies(topRatedTitles);
  const { movies: freeMovies, loading: loading4 } = usePublicDomainMovies();

  const activeCategoryTitles =
    categories.find((c) => c.key === activeCategory)?.titles || [];
  const { movies: categoryMovies, loading: loadingCategory } = useMovies(
    activeCategoryTitles
  );

  const isLoading = loading1 || loading2 || loading3 || loading4;

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
        <>
          <SkeletonHero />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      ) : (
        <>
          <HeroBanner movie={featuredMovie} />

          <div className="px-8">
            <SearchBar onSelectMovie={setSelectedMovie} />
            <GptSearch onResult={setGptResult} />
            <GptResult result={gptResult} />
          </div>

          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          {loadingCategory ? (
            <SkeletonRow />
          ) : (
            <MovieList
              title={categories.find((c) => c.key === activeCategory)?.label}
              movies={categoryMovies}
              onMovieClick={setSelectedMovie}
            />
          )}

          <MovieList title={t("trendingNow")} movies={trending} onMovieClick={setSelectedMovie} />
          <MovieList title={t("popular")} movies={popular} onMovieClick={setSelectedMovie} />
          <MovieList title={t("topRated")} movies={topRated} onMovieClick={setSelectedMovie} />
          <MovieList title="🎬 Free Classic Movies (Watch Now)" movies={freeMovies} onMovieClick={setSelectedMovie} />
        </>
      )}

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
      />
    </div>
  );
}

export default Browse;