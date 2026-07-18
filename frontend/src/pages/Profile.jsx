import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import { updateUserProfile } from "../firebase/authService";
import { addUser } from "../store/userSlice";

function Profile() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.displayName || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateUserProfile(name);
      dispatch(addUser({ ...user, displayName: name }));
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile. Try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-24 pb-10 px-8">
      <Navbar />

      <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-white text-2xl font-bold mb-6">My Profile</h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3 rounded bg-gray-800 text-gray-500 outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600"
              required
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes("success") ? "text-green-400" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-3 rounded font-semibold"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;