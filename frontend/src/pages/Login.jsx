import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../firebase/authService";
import { addUser } from "../store/userSlice";
import { motion } from "framer-motion";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let user;
      if (isSignup) {
        user = await signupUser(email, password, name);
      } else {
        user = await loginUser(email, password);
      }
      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      navigate("/browse");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="bg-gray-900 p-10 rounded-lg w-96 flex flex-col gap-4"
      >
        <h1 className="text-white text-2xl font-bold mb-2">
          {isSignup ? "Sign Up" : "Sign In"}
        </h1>

        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded bg-gray-800 text-white outline-none"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white outline-none"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded font-semibold"
        >

          {isSignup ? "Sign Up" : "Sign In"}
        </motion.button>
        <p
          className="text-gray-400 cursor-pointer text-sm"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Sign In"
            : "New here? Sign Up"}
        </p>
      </motion.form>
    </div>
  );
}

export default Login;