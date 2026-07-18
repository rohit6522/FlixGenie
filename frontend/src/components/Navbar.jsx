import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../firebase/authService";
import { removeUser } from "../store/userSlice";

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(removeUser());
    navigate("/");
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  return (
    <div className="fixed top-0 w-full z-20 flex justify-between items-center px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
      <div className="flex items-center gap-6">
        <Link to="/browse" className="text-red-600 text-2xl font-bold">
          {t("appName")}
        </Link>
        {user && (
          <>
            <Link to="/watchlist" className="text-white text-sm hover:text-gray-300">
              {t("myWatchlist")}
            </Link>
            <Link to="/profile" className="text-white text-sm hover:text-gray-300">
              {t("profile")}
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-sm"
        >
          {i18n.language === "en" ? "हिं" : "EN"}
        </button>
        {user && (
          <>
            <span className="text-white text-sm hidden sm:block">
              {user.displayName || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
            >
              {t("signOut")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;