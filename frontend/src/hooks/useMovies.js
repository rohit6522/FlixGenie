import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useMovies = (titles) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axios
      .post(`${BACKEND_URL}/api/omdb/bulk`, { titles })
      .then(({ data }) => {
        if (!cancelled) setMovies(data.results || []);
      })
      .catch((error) => console.error("Error fetching movies:", error.message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [titles]);

  return { movies, loading };
};