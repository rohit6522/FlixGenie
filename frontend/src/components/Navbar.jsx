import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/authService";
import { removeUser } from "../store/userSlice";

function Navbar() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    dispatch(removeUser());
    navigate("/");
  };

  return (
    <div className="fixed top-0 w-full z-20 flex justify-between items-center px-8 py-4 bg-gradient-to-b from-black/80 to-transparent">
      <h1 className="text-red-600 text-2xl font-bold">FlixGenie</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-white text-sm hidden sm:block">
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;