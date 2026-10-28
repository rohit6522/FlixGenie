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
      <div className="bg-[#08080c] min-h-screen flex flex-col items-center justify-center gap-4 select-none">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-red-600/40 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-red-600/20 blur-xl animate-ping opacity-30" />
        </div>
        <div className="text-center">
          <span className="text-2xl font-black italic tracking-tight bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent">
            FLIXGENIE
          </span>
          <div className="w-24 h-1 bg-white/10 rounded-full mx-auto mt-3 overflow-hidden">
            <div className="w-full h-full bg-red-600 rounded-full animate-[shimmer_1.5s_infinite]" />
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
