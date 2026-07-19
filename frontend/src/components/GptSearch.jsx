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
                placeholder={t("askAiPlaceholder")} value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold"
            >
                {loading ? "Thinking..." : t("askAi")}      </button>
        </form>
    );
}

export default GptSearch;