import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function SearchBar({ onSelectMovie }) {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { t } = useTranslation();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/omdb/search`, {
                params: { title: query },
            });

            if (data.Response === "True") {
                setResult(data);
            } else {
                setError("Movie not found. Try another title.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                <input
                    type="text"
                   placeholder={t("searchPlaceholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-3 rounded bg-gray-800 text-white outline-none border border-gray-700 focus:border-red-600"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white px-6 py-3 rounded font-semibold"
                >
                    {loading ? "..." : `🔍 ${t("search")}`}        </button>
            </form>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {result && (
                <div
                    onClick={() => onSelectMovie(result)}
                    className="flex gap-4 bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-red-600 transition-colors max-w-md"
                >
                    {result.Poster !== "N/A" && (
                        <img src={result.Poster} alt={result.Title} className="w-20 rounded" />
                    )}
                    <div>
                        <h3 className="text-white font-semibold">{result.Title}</h3>
                        <p className="text-gray-400 text-sm">{result.Year}</p>
                        <p className="text-green-400 text-sm">⭐ {result.imdbRating}/10</p>
                        <p className="text-gray-500 text-xs mt-1">Click to view details</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;