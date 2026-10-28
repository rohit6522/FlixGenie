import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Send,
  RotateCcw,
  X,
  Copy,
  Check,
  Brain,
  Laugh,
  Flame,
  Ghost,
  Film,
  Compass,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const suggestions = [
  { icon: Brain, text: "Mind-bending sci-fi like Inception & Tenet" },
  { icon: Laugh, text: "Feel-good comfort comedies with heart" },
  { icon: Flame, text: "Underrated gripping crime thrillers with huge twists" },
  { icon: Ghost, text: "Atmospheric psychological horror films" },
  { icon: Film, text: "Visually stunning cyberpunk movies" },
  { icon: Compass, text: "Epic space exploration adventures" },
];

function GptSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#1a070c] via-[#0d0710] to-[#08080c] p-6 md:p-10 mb-12 shadow-2xl shadow-red-950/30">
      {/* Decorative ambient flares */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-red-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-red-600/30 ring-1 ring-white/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  FlixGenie AI Assistant
                </h2>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-red-500/30">
                  Powered by LLaMA 3.3
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Describe a mood, plot twist, or vibe and let our AI curate the perfect films.
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={200}
              placeholder={t("askAiPlaceholder", "e.g. Suggest me a mind-bending sci-fi movie with great plot twists")}
              className="w-full h-14 pl-5 pr-16 rounded-2xl bg-black/60 border border-white/15 text-white text-sm md:text-base outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 backdrop-blur-md transition-all placeholder-gray-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
              {query.length}/200
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-14 px-8 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-red-600/25 active:scale-95 flex-shrink-0"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? "Analyzing..." : "Ask Genie"}</span>
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs text-gray-400 font-semibold mr-1">Try asking:</span>
          {suggestions.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.text}
                type="button"
                onClick={() => pickSuggestion(s.text)}
                disabled={loading}
                className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 px-3.5 py-1.5 rounded-full transition-all disabled:opacity-50 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-red-400" />
                <span>{s.text}</span>
              </button>
            );
          })}
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl bg-black/40 border border-white/10 p-6 space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400 mb-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Brewing tailored recommendations...</span>
              </div>
              <div className="shimmer h-4 rounded-md w-1/3" />
              <div className="shimmer h-4 rounded-md w-full" />
              <div className="shimmer h-4 rounded-md w-5/6" />
              <div className="shimmer h-4 rounded-md w-3/4" />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl bg-red-950/40 border border-red-800/50 p-5 flex items-center justify-between gap-4"
            >
              <p className="text-red-300 text-sm font-medium">{error}</p>
              <button
                onClick={() => runSearch(lastQuery)}
                className="text-white text-xs bg-red-800/60 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Try again
              </button>
            </motion.div>
          )}

          {!loading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-2xl bg-black/60 border border-red-500/30 p-6 md:p-8 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <p className="text-red-400 text-xs font-bold uppercase tracking-wider">
                      Genie's Curated Picks
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm mt-1 font-medium">
                    Results for "{lastQuery}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyResult}
                    title="Copy response"
                    className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <button
                    onClick={clear}
                    aria-label="Clear result"
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formatted Text Content */}
              <div className="text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-line space-y-2">
                {result}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <button
                  onClick={() => runSearch(lastQuery)}
                  className="flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-xl transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate Suggestions</span>
                </button>
                <button
                  onClick={clear}
                  className="text-xs font-medium text-gray-400 hover:text-white px-3 py-2 transition-colors"
                >
                  Dismiss
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
