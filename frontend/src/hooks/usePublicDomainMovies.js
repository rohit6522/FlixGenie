import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const usePublicDomainMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/archive/movies`);
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching archive movies:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return { movies, loading };
};