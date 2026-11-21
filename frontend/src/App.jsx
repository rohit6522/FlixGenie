import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { Sparkles } from "lucide-react";
import { auth } from "./firebase/firebaseConfig";
import { addUser, removeUser } from "./store/userSlice";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import Watchlist from "./pages/Watchlist";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(removeUser());
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (checkingAuth) {
    return (
      <div className="bg-[#141414] min-h-screen flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-[#e50914] flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="text-center">
          <span className="text-2xl font-black italic tracking-tight text-[#e50914]">
            FLIXGENIE
          </span>
          <div className="w-24 h-1 bg-neutral-800 rounded-full mx-auto mt-3 overflow-hidden">
            <div className="w-1/2 h-full bg-[#e50914] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
