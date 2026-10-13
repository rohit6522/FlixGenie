import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { updateUserProfile } from "../firebase/authService";
import { addUser } from "../store/userSlice";

function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.displayName || "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateUserProfile(name);
      dispatch(addUser({ ...user, displayName: name }));
      setIsError(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setIsError(true);
      setMessage("Failed to update profile. Try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const initial = (user?.displayName || user?.email || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto pt-28 px-6 pb-16"
      >
        <h1 className="text-4xl font-medium mb-2">Account</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span className="text-red-500">●</span> FlixGenie Member
        </div>

        {/* Profile header */}
        <div className="border-t border-gray-700 py-6 grid md:grid-cols-[200px_1fr] gap-4">
          <h2 className="text-gray-400 text-sm tracking-widest uppercase">Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-red-600 flex items-center justify-center text-3xl font-bold">
              {initial}
            </div>
            <div>
              <p className="text-lg font-medium">{user?.displayName || "No name set"}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleUpdate}
          className="border-t border-gray-700 py-6 grid md:grid-cols-[200px_1fr] gap-4"
        >
          <h2 className="text-gray-400 text-sm tracking-widest uppercase">Details</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full h-12 px-4 rounded bg-[#2a2a2a] text-gray-500 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Display name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded bg-[#2a2a2a] text-white outline-none border border-transparent focus:border-white transition-colors"
                required
              />
            </div>

            {message && (
              <p className={`text-sm ${isError ? "text-red-400" : "text-green-400"}`}>{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-fit bg-white hover:bg-gray-200 disabled:opacity-60 text-black px-8 py-3 rounded font-semibold text-sm transition-colors"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Profile;