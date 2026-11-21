import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  Film,
  Sparkles,
  Clapperboard,
  Tv,
  Gift,
  ChevronDown,
} from "lucide-react";
import { logoutUser } from "../firebase/authService";
import { removeUser } from "../store/userSlice";
import NavSearch from "./NavSearch";
import MovieModal from "./MovieModal";

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { t, i18n } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname, location.search]);

  // Press "/" anywhere to open search
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const view = params.get("view") || "home";
  const onBrowse = location.pathname === "/browse";

  const links = [
    { label: t("navHome", "Home"), to: "/browse", active: onBrowse && view === "home", icon: Film },
    { label: t("navMovies", "Movies"), to: "/browse?view=movies", active: onBrowse && view === "movies", icon: Clapperboard },
    { label: t("navTv", "TV Shows"), to: "/browse?view=tv", active: onBrowse && view === "tv", icon: Tv },
    { label: t("navClassics", "Free Classics"), to: "/browse?view=classics", active: onBrowse && view === "classics", icon: Gift },
  ];

  const handleLogout = async () => {
    await logoutUser();
    dispatch(removeUser());
    navigate("/");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  const openSearch = () => {
    setMenuOpen(false);
    setProfileOpen(false);
    setSearchOpen(true);
  };

  const handleSelectResult = (movie) => {
    setSelectedMovie(movie);
    setSearchOpen(false);
  };

  const initial = (user?.displayName || user?.email || "?")[0].toUpperCase();

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-40 h-20 px-4 md:px-10 flex items-center justify-between transition-all duration-300 ${
          scrolled || menuOpen || searchOpen
            ? "bg-[#141414] shadow-xl border-b border-neutral-800"
            : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"
        }`}
      >
        {searchOpen ? (
          <NavSearch onClose={closeSearch} onSelect={handleSelectResult} />
        ) : (
          <>
            {/* Left: Brand Logo & Desktop Nav Links */}
            <div className="flex items-center gap-8">
              <Link
                to="/browse"
                className="group flex items-center gap-2.5 text-2xl md:text-3xl font-black italic tracking-tight select-none"
              >
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 fill-white/20" />
                </div>
                <span className="text-red-600">
                  {t("appName", "FlixGenie")}
                </span>
              </Link>

              {/* Desktop links */}
              <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                      l.active
                        ? "text-white bg-white/10 shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {l.label}
                    {l.active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Search bar, Language, Watchlist, Profile */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Quick Search Trigger */}
              <button
                onClick={openSearch}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 hover:text-white transition-all text-xs"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="hidden sm:inline text-gray-400">Search titles...</span>
                <kbd className="hidden sm:inline px-1.5 py-0.2 bg-white/10 rounded text-[10px] text-gray-400 font-mono">
                  /
                </kbd>
              </button>

              {/* AI Genie Shortcut */}
              <a
                href="#ai-section"
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-medium transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>AI Genie</span>
              </a>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                title="Switch Language"
                className="flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 px-2.5 py-1.5 rounded-full transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{i18n.language === "en" ? "HI" : "EN"}</span>
              </button>

              {user ? (
                <>
                  <Link
                    to="/watchlist"
                    title={t("myWatchlist")}
                    className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      location.pathname === "/watchlist"
                        ? "bg-red-600/20 text-red-400 border border-red-500/30"
                        : "text-gray-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10"
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{t("myWatchlist")}</span>
                  </Link>

                  {/* Profile Dropdown */}
                  <div
                    className="relative"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-white/20 shadow-md">
                        {initial}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full pt-2 w-60 z-50"
                        >
                          <div className="glass-panel rounded-2xl p-2 text-sm shadow-2xl border border-white/10 divide-y divide-white/5">
                            <div className="px-3 py-2.5">
                              <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                              <p className="text-sm font-semibold text-white truncate">
                                {user.displayName || user.email}
                              </p>
                              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded-full">
                                Free VIP Member
                              </span>
                            </div>

                            <div className="py-1">
                              <Link
                                to="/profile"
                                className="flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                              >
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{t("profile")}</span>
                              </Link>
                              <Link
                                to="/watchlist"
                                className="flex items-center gap-2.5 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                              >
                                <Bookmark className="w-4 h-4 text-gray-400" />
                                <span>{t("myWatchlist")}</span>
                              </Link>
                            </div>

                            <div className="pt-1">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>{t("signOut")}</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link
                  to="/"
                  className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-md shadow-red-900/40"
                >
                  {t("signIn")}
                </Link>
              )}

              {/* Mobile hamburger toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </>
        )}
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && !searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-20 inset-x-0 z-30 bg-[#0c0c14]/95 border-b border-white/10 backdrop-blur-2xl px-6 py-5 shadow-2xl"
          >
            <div className="space-y-1">
              {links.map((l) => {
                const IconComponent = l.icon;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      l.active
                        ? "bg-red-600 text-white shadow-lg shadow-red-950"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{l.label}</span>
                  </Link>
                );
              })}

              {user && (
                <Link
                  to="/watchlist"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === "/watchlist"
                      ? "bg-red-600 text-white"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{t("myWatchlist")}</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Movie Modal triggered from search or anywhere */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
      />
    </>
  );
}

export default Navbar;
