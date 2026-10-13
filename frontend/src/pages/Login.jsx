import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, signupUser, resetPassword } from "../firebase/authService";
import { addUser } from "../store/userSlice";

function FloatingInput({ id, type = "text", label, value, onChange, autoFocus }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoFocus={autoFocus}
        required
        className="peer w-full h-[64px] px-5 pt-4 rounded-md bg-black/60 border border-gray-500 text-white text-base outline-none focus:border-white transition-colors"
      />
      <label
        htmlFor={id}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none transition-all peer-focus:top-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
}

const friendlyError = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
};

function Login() {
  const [step, setStep] = useState(1);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const user = isSignup
        ? await signupUser(email, password, name)
        : await loginUser(email, password);

      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        })
      );
      navigate("/browse");
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError("");
    setInfo("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter your email above first, then click 'Forgot password?'");
      setStep(1);
      return;
    }
    try {
      await resetPassword(email);
      setInfo(`Password reset link sent to ${email}. Check your inbox.`);
    } catch (err) {
      setError(friendlyError(err.code));
    }
  };

  const switchMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setInfo("");
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3a1015] via-[#1a0608] to-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="px-6 md:px-[11%] py-6">
          <span className="text-red-600 text-3xl md:text-4xl font-black italic tracking-tight">
            FLIXGENIE
          </span>
        </div>
      </header>

      {/* Form area */}
      <div className="max-w-[550px] mx-auto px-6 pt-14 md:pt-20 pb-16">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleContinue}
            >
              <h1 className="text-3xl md:text-[32px] font-bold mb-2">
                {isSignup ? "Create your account" : "Enter your info to sign in"}
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                {isSignup ? (
                  <>
                    Already a member?{" "}
                    <button type="button" onClick={switchMode} className="underline hover:text-white">
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Or{" "}
                    <button type="button" onClick={switchMode} className="underline hover:text-white">
                      get started with a new account.
                    </button>
                  </>
                )}
              </p>

              <FloatingInput
                id="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
              {info && <p className="text-green-400 text-sm mt-3">{info}</p>}

              <button
                type="submit"
                className="w-full h-[56px] mt-4 bg-[#e50914] hover:bg-[#c11119] rounded-md font-bold text-lg transition-colors"
              >
                Continue
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
            >
              <h1 className="text-3xl md:text-[32px] font-bold mb-2">
                {isSignup ? "Set up your account" : "Welcome back"}
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                {email}{" "}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="underline text-base hover:text-white"
                >
                  Change
                </button>
              </p>

              <div className="flex flex-col gap-4">
                {isSignup && (
                  <FloatingInput
                    id="name"
                    label="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                )}
                <FloatingInput
                  id="password"
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus={!isSignup}
                />
              </div>

              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] mt-4 bg-[#e50914] hover:bg-[#c11119] disabled:opacity-60 rounded-md font-bold text-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isSignup ? "Create Account" : "Sign In"}
              </button>

              {!isSignup && (
                <button
                  type="button"
                  onClick={handleForgot}
                  className="block mx-auto mt-4 text-gray-300 underline hover:text-white text-sm"
                >
                  Forgot password?
                </button>
              )}
              {info && <p className="text-green-400 text-sm mt-3 text-center">{info}</p>}
            </motion.form>
          )}
        </AnimatePresence>

        {/* Get Help */}
        <div className="mt-12">
          <button
            onClick={() => setHelpOpen(!helpOpen)}
            className="flex items-center gap-2 text-lg hover:text-gray-300"
          >
            Get Help
            <span className={`transition-transform text-sm ${helpOpen ? "rotate-180" : ""}`}>⌄</span>
          </button>

          {helpOpen && (
            <div className="mt-3 flex flex-col gap-3">
              <button onClick={handleForgot} className="text-left underline hover:text-gray-300 w-fit">
                Forgot password?
              </button>
              <button onClick={switchMode} className="text-left underline hover:text-gray-300 w-fit">
                {isSignup ? "Already have an account? Sign in" : "New to FlixGenie? Sign up now"}
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-8">
          Your account is secured with Firebase Authentication.
        </p>
      </div>
    </div>
  );
}

export default Login;