import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Add movie to user's watchlist
export const addToWatchlist = async (userId, movie) => {
  const movieRef = doc(db, "users", userId, "watchlist", movie.imdbID);
  await setDoc(movieRef, movie);
};

// Remove movie from user's watchlist
export const removeFromWatchlist = async (userId, imdbID) => {
  const movieRef = doc(db, "users", userId, "watchlist", imdbID);
  await deleteDoc(movieRef);
};

// Get all movies in user's watchlist
export const getWatchlist = async (userId) => {
  const watchlistRef = collection(db, "users", userId, "watchlist");
  const snapshot = await getDocs(watchlistRef);
  return snapshot.docs.map((doc) => doc.data());
};