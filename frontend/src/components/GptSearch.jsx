import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const suggestions = [
  { icon: "🧠", text: "Mind-bending sci-fi like Inception" },
  { icon: "😂", text: "Feel-good comedy for a lazy Sunday" },
  { icon: "🎪", text: "Underrated Bollywood thrillers" },
  { icon: "👻", text: "Scary horror films that are actually good" },
  { icon: "🎌", text: "Anime movies for beginners" },
  { icon: "🔥", text: "Edge-of-the-seat crime dramas" },
];

function GptSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const runSearch = async (text) => {
    const prompt = text.trim();
    if (!prompt || loading) return;

    setLoading(true);
    setError("");
    setResult("");
    setLastQuery(prompt);

    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/recommend`, { prompt });
      setResult(data.result);
    } catch (err) {
      console.error("GPT Search Error:", err.message);
      setError("Sorry, the AI couldn't respond right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const pickSuggestion = (text) => {
    setQuery(text);
    runSearch(text);
  };

  const clear = () => {
    setQuery("");
    setLastQuery("");
    setResult("");
    setError("");
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#2a0a10] via-[#150508] to-[#0a0a0a] p-6 md:p-8 mb-10">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-red-900/20 blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center text-lg shadow-lg shadow-red-900/40">
            ✨
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">Ask FlixGenie</h2>
            <p className="text-gray-400 text-sm">
              Describe a mood, genre or plot and let AI pick your next watch.
            </p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={200}
              placeholder={t("askAiPlaceholder")}
              className="w-full h-12 pl-4 pr-16 rounded-lg bg-black/50 border border-white/15 text-white text-sm outline-none focus:border-red-500 focus:bg-black/70 transition-colors placeholder-gray-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500">
              {query.length}/200
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-12 px-7 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>✨</span>
            )}
            {loading ? "Thinking..." : t("askAi")}
          </button>
        </form>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {suggestions.map((s) => (
            <button
              key={s.text}
              type="button"
              onClick={() => pickSuggestion(s.text)}
              disabled={loading}
              className="text-xs md:text-sm text-gray-300 bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              {s.icon} {s.text}
            </button>
          ))}
        </div>

        {/* Result area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl bg-black/40 border border-white/10 p-5 space-y-3"
            >
              <div className="shimmer h-4 rounded w-1/3" />
              <div className="shimmer h-4 rounded w-full" />
              <div className="shimmer h-4 rounded w-5/6" />
              <div className="shimmer h-4 rounded w-2/3" />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-xl bg-red-950/40 border border-red-900/50 p-4 flex items-center justify-between gap-4"
            >
              <p className="text-red-300 text-sm">{error}</p>
              <button
                onClick={() => runSearch(lastQuery)}
                className="text-white text-sm underline hover:text-gray-300 flex-shrink-0"
              >
                Try again
              </button>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-xl bg-black/50 border border-red-900/40 p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-red-500 text-xs font-semibold uppercase tracking-widest">
                    FlixGenie suggests
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">for "{lastQuery}"</p>
                </div>
                <button
                  onClick={clear}
                  aria-label="Clear result"
                  className="text-gray-500 hover:text-white text-lg leading-none flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-100 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {result}
              </p>

              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => runSearch(lastQuery)}
                  className="text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors"
                >
                  ↻ Regenerate
                </button>
                <button
                  onClick={clear}
                  className="text-sm text-gray-400 hover:text-white px-4 py-1.5 transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default GptSearch;