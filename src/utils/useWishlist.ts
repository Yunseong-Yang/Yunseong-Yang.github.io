import { useState, useEffect } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "./LocalStorageHelper";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Movie[]>([]);

  useEffect(() => {
    const storedWishlist = getFromLocalStorage("wishlist");
    if (storedWishlist) {
      setWishlist(storedWishlist);
    }
  }, []);

  const toggleWishlist = (movie: Movie) => {
    const isInWishlist = wishlist.some((item) => item.id === movie.id);
    const updatedWishlist = isInWishlist
      ? wishlist.filter((item) => item.id !== movie.id)
      : [...wishlist, movie];

    setWishlist(updatedWishlist);
    saveToLocalStorage("wishlist", updatedWishlist);
  };

  const isMovieInWishlist = (id: number) => {
    return wishlist.some((movie) => movie.id === id);
  };

  return { wishlist, toggleWishlist, isMovieInWishlist };
};

export default useWishlist;
