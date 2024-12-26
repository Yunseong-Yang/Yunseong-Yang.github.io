import React, { useState, useEffect } from "react";
import BannerSlider from "../components/BannerSlider";
import MovieRow from "../components/MovieRow";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
}

const MainPage: React.FC = () => {
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [familyMovies, setFamilyMovies] = useState<Movie[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
  const [wishlist, setWishlist] = useState<Movie[]>([]);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    if (!apiKey) {
      console.error("API 키가 없습니다. 로그인하세요.");
      return;
    }

    const fetchMovies = async (
      url: string,
      setState: React.Dispatch<React.SetStateAction<Movie[]>>
    ) => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        const moviesWithFullPath = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        setState(moviesWithFullPath || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    

    const baseUrl = "https://api.themoviedb.org/3";
    fetchMovies(`${baseUrl}/discover/movie?with_genres=28&api_key=${apiKey}`, setActionMovies);
    fetchMovies(`${baseUrl}/discover/movie?with_genres=10751&api_key=${apiKey}`, setFamilyMovies);
    fetchMovies(`${baseUrl}/discover/movie?with_genres=10749&api_key=${apiKey}`, setRomanceMovies);

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const toggleWishlist = (movie: Movie) => {
    const isInWishlist = wishlist.some((item) => item.id === movie.id);
    const updatedWishlist = isInWishlist
      ? wishlist.filter((item) => item.id !== movie.id)
      : [...wishlist, movie];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const isMovieInWishlist = (id: number) => wishlist.some((movie) => movie.id === id);

  return (
    <div className="main-page">
      <BannerSlider />
      <div style={{ marginTop: "40px" }}>
        <MovieRow
          title="액션 영화"
          movies={actionMovies}
          toggleWishlist={toggleWishlist}
          isMovieInWishlist={isMovieInWishlist}
        />
        <MovieRow
          title="어린이 영화"
          movies={familyMovies}
          toggleWishlist={toggleWishlist}
          isMovieInWishlist={isMovieInWishlist}
        />
        <MovieRow
          title="로맨스 영화"
          movies={romanceMovies}
          toggleWishlist={toggleWishlist}
          isMovieInWishlist={isMovieInWishlist}
        />
      </div>
    </div>
  );
};

export default MainPage;
