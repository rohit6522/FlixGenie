import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  ShieldCheck,
  Sparkles,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Tv,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { updateUserProfile } from "../firebase/authService";
import { addUser } from "../store/userSlice";
import { getWatchlist } from "../firebase/watchlistService";

function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.displayName || "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.uid) {
        try {
          const list = await getWatchlist(user.uid);
          setWatchlistCount(list?.length || 0);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchStats();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateUserProfile(name);
      dispatch(addUser({ ...user, displayName: name }));
      setIsError(false);
      setMessage("Profile display name updated successfully!");
    } catch (error) {
      setIsError(true);
      setMessage("Failed to update profile. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initial = (user?.displayName || user?.email || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#08080c] text-white select-none">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto pt-28 px-6 pb-20"
      >
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Account & Profile</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Manage your personal settings and streaming preferences</p>
          </div>
        </div>

        {/* Member Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center flex-shrink-0">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Watchlist Queue</p>
              <p className="text-xl font-bold text-white">{watchlistCount} Titles</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Account Status</p>
              <p className="text-xl font-bold text-white">Free VIP Pass</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Playback Tier</p>
              <p className="text-xl font-bold text-white">4K Ultra HD</p>
            </div>
          </div>
        </div>

        {/* Profile Card & Form */}
        <div className="rounded-3xl bg-[#0f0f16] border border-white/10 p-6 md:p-8 space-y-8 shadow-2xl">
          {/* Avatar and Email header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-red-950 ring-4 ring-white/10 flex-shrink-0">
              {initial}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-white">
                  {user?.displayName || "FlixGenie Cinephile"}
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Active Session
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address (Protected)</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.03] text-gray-400 border border-white/5 outline-none cursor-not-allowed text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Display Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-12 px-4 rounded-xl bg-white/[0.05] text-white border border-white/10 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-sm transition-all"
                  required
                />
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                  isError
                    ? "bg-red-950/40 border border-red-800 text-red-300"
                    : "bg-emerald-950/40 border border-emerald-800 text-emerald-300"
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{message}</span>
              </motion.div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 active:scale-95 disabled:opacity-50 text-white px-7 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-950 flex items-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? "Updating..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
