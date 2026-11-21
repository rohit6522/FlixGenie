import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginUser, signupUser, resetPassword } from "../firebase/authService";
import { addUser } from "../store/userSlice";

const friendlyError = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please verify and try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
      setInfo(`Password reset instructions sent to ${email}. Check your inbox.`);
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
    <div className="relative min-h-screen bg-[#141414] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Netflix Movie Poster Grid Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none scale-105"
        style={{
          backgroundImage: `url('https://assets.nflxext.com/ffe/siteui/vlv3/d8f11ec4-32f4-41b2-b9e8-5733e8b4e183/c9890a5a-939e-4a69-a1d2-0fb3a925ee8e/US-en-20231120-popsignuptwoweeks-perspective_alpha_website_medium.jpg')`,
        }}
      />
      {/* Netflix Dark Overlay Scrim */}
      <div className="absolute inset-0 bg-black/65 bg-gradient-to-t from-[#141414] via-black/40 to-[#141414]/90 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 fill-white/20" />
          </div>
          <span className="text-2xl sm:text-3xl font-black italic tracking-tight text-red-600">
            FLIXGENIE
          </span>
        </div>

        <button
          onClick={switchMode}
          className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
        >
          {isSignup ? "Sign In" : "Sign Up"}
        </button>
      </header>

      {/* Form Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[450px] rounded-md bg-black/75 backdrop-blur-md border border-neutral-800 p-8 sm:p-14 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleContinue}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isSignup ? "Create your account" : "Welcome back"}
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={switchMode}
                          className="text-red-400 hover:underline font-semibold"
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        New to FlixGenie?{" "}
                        <button
                          type="button"
                          onClick={switchMode}
                          className="text-red-400 hover:underline font-semibold"
                        >
                          Sign up for free
                        </button>
                      </>
                    )}
                  </p>
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoFocus
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder-gray-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {info && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{info}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isSignup ? "Set up your profile" : "Enter password"}
                  </h1>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                    <span className="truncate text-white font-medium">{email}</span>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-red-400 hover:underline text-xs"
                    >
                      (change)
                    </button>
                  </p>
                </div>

                {isSignup && (
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        autoFocus
                        required
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder-gray-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoFocus={!isSignup}
                      required
                      className="w-full h-12 pl-11 pr-11 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {info && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-2 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{info}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  {loading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{isSignup ? "Create VIP Account" : "Sign In"}</span>
                </button>

                {!isSignup && (
                  <button
                    type="button"
                    onClick={handleForgot}
                    className="block mx-auto text-xs text-gray-400 hover:text-white hover:underline pt-2"
                  >
                    Forgot password?
                  </button>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Help collapsible */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-400">
            <button
              onClick={() => setHelpOpen(!helpOpen)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need help signing in?</span>
            </button>

            {helpOpen && (
              <div className="mt-3 space-y-2 pl-5 text-gray-400">
                <p>
                  • Ensure you're entering the email used during registration.
                </p>
                <p>
                  • Try resetting your password if you forgot your credentials.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-600 flex items-center justify-center gap-2">
        <Shield className="w-3.5 h-3.5 text-gray-500" />
        <span>End-to-end encrypted with Firebase Authentication</span>
      </footer>
    </div>
  );
}

export default Login;
