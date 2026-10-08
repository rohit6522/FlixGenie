import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function GptSearch({ onResult }) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/recommend`, {
                prompt: query,
            });
            onResult(data.result);
        } catch (error) {
            console.error("GPT Search Error:", error.message);
            onResult("Sorry, something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 mb-8"
        >
            <input
                type="text"
                placeholder={t("askAiPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={200}
                className="flex-1 p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600"
            />
            <p className="text-gray-500 text-xs">{query.length}/200</p>
            <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold flex items-center gap-2"
            >
                {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <span>✨</span>
                )}
                {loading ? "Thinking..." : t("askAi")}
            </button>
        </form>
    );
}

export default GptSearch;