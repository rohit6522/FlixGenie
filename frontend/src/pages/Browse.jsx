import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import MovieList from "../components/MovieList";
import MovieCard from "../components/MovieCard";
import GptSearch from "../components/GptSearch";
import HeroBanner from "../components/HeroBanner";
import Top10Row from "../components/Top10Row";
import MovieModal from "../components/MovieModal";
import CategoryTabs from "../components/CategoryTabs";
import SkeletonRow from "../components/SkeletonRow";
import SkeletonHero from "../components/SkeletonHero";
import SkeletonCard from "../components/SkeletonCard";
import ScrollToTop from "../components/ScrollToTop";
import { useMovies } from "../hooks/useMovies";
import { usePublicDomainMovies } from "../hooks/usePublicDomainMovies";
import {
  trendingTitles,
  popularTitles,
  topRatedTitles,
  hollywoodTitles,
  southMovieTitles,
  webSeriesTitles,
  bollywoodTitles,
  horrorTitles,
  comedyTitles,
  animeTitles,
} from "../utils/movieLists";

const movieCategories = [
  { key: "hollywood", label: "🎬 Hollywood", titles: hollywoodTitles },
  { key: "bollywood", label: "🎪 Bollywood", titles: bollywoodTitles },
  { key: "south", label: "🎭 South Movies", titles: southMovieTitles },
  { key: "horror", label: "👻 Horror", titles: horrorTitles },
  { key: "comedy", label: "😂 Comedy", titles: comedyTitles },
  { key: "anime", label: "🎌 Anime", titles: animeTitles },
];

const homeCategories = [
  ...movieCategories,
  { key: "webseries", label: "📺 Web Series", titles: webSeriesTitles },
];

/* ---------- Reusable grid ---------- */
function GridSection({ movies, loading, onSelect }) {
  if (loading) {
    return (
      <div className="flex flex-wrap gap-y-6 px-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (!movies.length) {
    return <p className="px-8 text-gray-400">No titles found.</p>;
  }
  return (
    <div className="flex flex-wrap gap-y-6 px-8 pb-10">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} onClick={onSelect} />
      ))}
    </div>
  );
}

/* ---------- Views ---------- */
function HomeView({ onSelect, onPlay }) {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState(null);
  const [activeCategory, setActiveCategory] = useState("hollywood");

  const { movies: trending, loading: l1 } = useMovies(trendingTitles);
  const { movies: popular, loading: l2 } = useMovies(popularTitles);
  const { movies: topRated, loading: l3 } = useMovies(topRatedTitles);
  const { movies: tvShows } = useMovies(webSeriesTitles);

  const activeCat = homeCategories.find((c) => c.key === activeCategory);
  const { movies: categoryMovies, loading: lc } = useMovies(activeCat.titles);

  const isLoading = l1 || l2 || l3;

  useEffect(() => {
    if (trending.length > 0 && !featured) {
      setFeatured(trending[Math.floor(Math.random() * trending.length)]);
    }
  }, [trending, featured]);

  const top10Movies = useMemo(() => {
    const seen = new Set();
    return [...trending, ...popular]
      .filter((m) => {
        if (!m.Poster || m.Poster === "N/A" || seen.has(m.imdbID)) return false;
        seen.add(m.imdbID);
        return true;
      })
      .slice(0, 10);
  }, [trending, popular]);

  const top10Tv = useMemo(
    () => tvShows.filter((m) => m.Poster && m.Poster !== "N/A").slice(0, 10),
    [tvShows]
  );

  return (
    <>
      {isLoading ? (
        <>
          <SkeletonHero />
          <div className="-mt-24 relative z-10">
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </>
      ) : (
        <>
          <HeroBanner movie={featured} onPlay={onPlay} />
          <div className="-mt-28 md:-mt-36 relative z-10">
            <MovieList title={t("trendingNow")} movies={trending} onMovieClick={onSelect} />
            <Top10Row
              title="Top 10 Movies on FlixGenie Today"
              movies={top10Movies}
              onMovieClick={onSelect}
            />
            <MovieList
              title="Top 10 TV Shows"
              movies={top10Tv}
              onMovieClick={onSelect}
              ranked
            />
          </div>
        </>
      )}

      {!isLoading && (
        <>
          <div id="ai-section" className="px-8 mt-4 scroll-mt-24">
            <GptSearch />
          </div>

          <CategoryTabs
            categories={homeCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />
          {lc ? (
            <SkeletonRow />
          ) : (
            <MovieList title={activeCat.label} movies={categoryMovies} onMovieClick={onSelect} />
          )}
          <MovieList title={t("popular")} movies={popular} onMovieClick={onSelect} />
          <MovieList title={t("topRated")} movies={topRated} onMovieClick={onSelect} />
        </>
      )}
    </>
  );
}

function MoviesView({ onSelect }) {
  const [active, setActive] = useState("hollywood");
  const cat = movieCategories.find((c) => c.key === active);
  const { movies, loading } = useMovies(cat.titles);

  return (
    <div className="pt-24">
      <h1 className="px-8 text-3xl md:text-4xl font-bold mb-4">Movies</h1>
      <CategoryTabs categories={movieCategories} activeCategory={active} onSelect={setActive} />
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

function TvView({ onSelect }) {
  const { movies, loading } = useMovies(webSeriesTitles);

  return (
    <div className="pt-24">
      <h1 className="px-8 text-3xl md:text-4xl font-bold mb-6">TV Shows</h1>
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

function ClassicsView({ onSelect }) {
  const { movies, loading } = usePublicDomainMovies();

  return (
    <div className="pt-24">
      <h1 className="px-8 text-3xl md:text-4xl font-bold mb-1">Free Classics</h1>
      <p className="px-8 text-gray-400 text-sm mb-6">
        Public domain films, free and legal to watch in full.
      </p>
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

/* ---------- Page ---------- */
function Browse() {
  const [params] = useSearchParams();
  const view = params.get("view") || "home";

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const openMovie = (movie) => {
    setAutoPlay(false);
    setSelectedMovie(movie);
  };
  const playMovie = (movie) => {
    setAutoPlay(true);
    setSelectedMovie(movie);
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      <Navbar />

      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {view === "movies" && <MoviesView onSelect={openMovie} />}
        {view === "tv" && <TvView onSelect={openMovie} />}
        {view === "classics" && <ClassicsView onSelect={openMovie} />}
        {view === "home" && <HomeView onSelect={openMovie} onPlay={playMovie} />}
      </motion.div>

      <footer className="text-center text-gray-500 text-xs mt-10 px-8 pb-6 border-t border-gray-900 pt-6">
        <p>Built with React, Firebase & Groq AI</p>
        <p className="mt-1">© 2026 FlixGenie, a student project for educational purposes</p>
      </footer>

      <MovieModal
        movie={selectedMovie}
        autoPlay={autoPlay}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={openMovie}
      />
      <ScrollToTop />
    </div>
  );
}

export default Browse;