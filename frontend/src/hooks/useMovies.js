import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

export const useMovies = (titles) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.post(`${BACKEND_URL}/api/omdb/bulk`, { titles });
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [titles]);

  return { movies, loading };
};  