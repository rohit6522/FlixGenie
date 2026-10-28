import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Film, Tv, Gift, Sparkles } from "lucide-react";
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

/* ---------- Modern Responsive Grid ---------- */
function GridSection({ movies, loading, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 px-6 md:px-12 pb-16">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (!movies.length) {
    return (
      <div className="px-6 md:px-12 py-16 text-center text-gray-400">
        <Film className="w-10 h-10 mx-auto text-gray-600 mb-2" />
        <p className="text-base font-semibold">No titles found.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 px-6 md:px-12 pb-16">
      {movies.map((movie) => (
        <div key={movie.imdbID} className="flex justify-center">
          <MovieCard movie={movie} onClick={onSelect} />
        </div>
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

  const activeCat = homeCategories.find((c) => c.key === activeCategory) || homeCategories[0];
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
          <HeroBanner movie={featured} onPlay={onPlay} onSelect={onSelect} />
          <div className="-mt-28 md:-mt-36 relative z-20">
            <MovieList title={t("trendingNow", "Trending Now")} movies={trending} onMovieClick={onSelect} />
            <Top10Row
              title="Top 10 Movies on FlixGenie Today"
              movies={top10Movies}
              onMovieClick={onSelect}
            />
            <MovieList
              title="Top 10 TV Shows Today"
              movies={top10Tv}
              onMovieClick={onSelect}
              ranked
            />
          </div>
        </>
      )}

      {!isLoading && (
        <>
          <div id="ai-section" className="px-6 md:px-12 mt-4 scroll-mt-24">
            <GptSearch />
          </div>

          <div className="mb-2">
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
          </div>

          <MovieList title={t("popular", "Popular on FlixGenie")} movies={popular} onMovieClick={onSelect} />
          <MovieList title={t("topRated", "Critically Acclaimed & Top Rated")} movies={topRated} onMovieClick={onSelect} />
        </>
      )}
    </>
  );
}

function MoviesView({ onSelect }) {
  const [active, setActive] = useState("hollywood");
  const cat = movieCategories.find((c) => c.key === active) || movieCategories[0];
  const { movies, loading } = useMovies(cat.titles);

  return (
    <div className="pt-28">
      <div className="px-6 md:px-12 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Movies</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">Explore curated blockbusters by region & genre</p>
          </div>
        </div>
      </div>
      <CategoryTabs categories={movieCategories} activeCategory={active} onSelect={setActive} />
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

function TvView({ onSelect }) {
  const { movies, loading } = useMovies(webSeriesTitles);

  return (
    <div className="pt-28">
      <div className="px-6 md:px-12 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">TV Shows & Series</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">Binge-worthy drama, thriller, and sci-fi series</p>
          </div>
        </div>
      </div>
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

function ClassicsView({ onSelect }) {
  const { movies, loading } = usePublicDomainMovies();

  return (
    <div className="pt-28">
      <div className="px-6 md:px-12 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Free Public Domain Classics</h1>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              100% legal, complete feature films preserved by the Internet Archive
            </p>
          </div>
        </div>
      </div>
      <GridSection movies={movies} loading={loading} onSelect={onSelect} />
    </div>
  );
}

/* ---------- Main Browse Page ---------- */
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
    <div className="bg-[#08080c] min-h-screen text-white select-none">
      <Navbar />

      <motion.div
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {view === "movies" && <MoviesView onSelect={openMovie} />}
        {view === "tv" && <TvView onSelect={openMovie} />}
        {view === "classics" && <ClassicsView onSelect={openMovie} />}
        {view === "home" && <HomeView onSelect={openMovie} onPlay={playMovie} />}
      </motion.div>

      {/* Modern Footer */}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#060609] py-12 px-6 md:px-12 text-center text-xs text-gray-500 space-y-3">
        <div className="flex items-center justify-center gap-2 text-white font-bold text-sm tracking-tight">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>FlixGenie Cinematic Universe</span>
        </div>
        <p className="max-w-md mx-auto text-gray-400">
          Powered by React, Tailwind CSS, Firebase Auth, Groq AI (LLaMA 3.3), and OMDb API.
        </p>
        <p className="text-gray-600">
          © 2026 FlixGenie. Public domain films sourced ethically via Internet Archive.
        </p>
      </footer>

      {/* Global Movie Details & Player Modal */}
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
