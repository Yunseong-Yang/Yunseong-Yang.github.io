import React, { useState, useEffect } from "react";
import "./WishlistPage.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Movie[]>([]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const removeFromWishlist = (id: number) => {
    const updatedWishlist = wishlist.filter((movie) => movie.id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div className="wishlist-container">
      <h2>추천 영화 목록</h2>
      <div className="wishlist-grid">
        {wishlist.map((movie) => (
          <div key={movie.id} className="wishlist-item">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="wishlist-overlay">
              <button onClick={() => removeFromWishlist(movie.id)}>
                제거
              </button>
            </div>
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
      {wishlist.length === 0 && <p>추천된 영화가 없습니다.</p>}
    </div>
  );
};

export default WishlistPage;
