import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
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
    { label: t("navHome", "Home"), to: "/browse", active: onBrowse && view === "home" },
    { label: t("navMovies", "Movies"), to: "/browse?view=movies", active: onBrowse && view === "movies" },
    { label: t("navTv", "TV Shows"), to: "/browse?view=tv", active: onBrowse && view === "tv" },
    { label: t("navClassics", "Free Classics"), to: "/browse?view=classics", active: onBrowse && view === "classics" },
  ];

  const linkClass = (active) =>
    `text-sm transition-colors ${
      active ? "text-white font-semibold" : "text-gray-300 hover:text-gray-100"
    }`;

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
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 w-full z-30 h-16 px-8 flex items-center justify-between transition-colors duration-300 ${
          scrolled || menuOpen || searchOpen
            ? "bg-[#0a0a0a]"
            : "bg-gradient-to-b from-black/90 to-transparent"
        }`}
      >
        {searchOpen ? (
          <NavSearch onClose={closeSearch} onSelect={handleSelectResult} />
        ) : (
          <>
            {/* Left: links (desktop) / hamburger (mobile) */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white text-2xl"
                aria-label="Menu"
              >
                ☰
              </button>
              <div className="hidden md:flex items-center gap-6">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className={linkClass(l.active)}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: logo */}
            <Link
              to="/browse"
              className="absolute left-1/2 -translate-x-1/2 text-red-600 text-2xl md:text-3xl font-black italic tracking-tight"
            >
              {t("appName")}
            </Link>

            {/* Right: search, language, my list, avatar */}
            <div className="flex items-center gap-4">
              <button
                onClick={openSearch}
                className="text-white hover:text-gray-300"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="20" y1="20" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <button
                onClick={toggleLanguage}
                className="text-white border border-gray-600 hover:border-white px-2 py-1 rounded text-xs transition-colors"
              >
                {i18n.language === "en" ? "हिं" : "EN"}
              </button>

              {user && (
                <>
                  <Link
                    to="/watchlist"
                    className={`hidden md:block ${linkClass(location.pathname === "/watchlist")}`}
                  >
                    {t("myWatchlist")}
                  </Link>

                  <div
                    className="relative"
                    onMouseEnter={() => setProfileOpen(true)}
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="w-8 h-8 rounded bg-red-600 text-white font-bold text-sm flex items-center justify-center"
                    >
                      {initial}
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-full pt-2 w-52">
                        <div className="bg-black/95 border border-gray-700 rounded py-2 text-sm">
                          <p className="px-4 py-2 text-gray-400 truncate border-b border-gray-800">
                            {user.displayName || user.email}
                          </p>
                          <Link to="/profile" className="block px-4 py-2 text-gray-200 hover:bg-gray-800">
                            {t("profile")}
                          </Link>
                          <Link to="/watchlist" className="block px-4 py-2 text-gray-200 hover:bg-gray-800">
                            {t("myWatchlist")}
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800 border-t border-gray-800"
                          >
                            {t("signOut")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
              <div className="md:hidden absolute top-full left-0 w-full bg-[#0a0a0a] border-t border-gray-800 py-2">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className={`block px-8 py-3 ${linkClass(l.active)}`}>
                    {l.label}
                  </Link>
                ))}
                {user && (
                  <Link
                    to="/watchlist"
                    className={`block px-8 py-3 ${linkClass(location.pathname === "/watchlist")}`}
                  >
                    {t("myWatchlist")}
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </motion.nav>

      {/* Modal for a search result, works on every page */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onSelectMovie={setSelectedMovie}
      />
    </>
  );
}

export default Navbar;