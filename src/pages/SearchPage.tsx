import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./SearchPage.css";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
}

const SearchPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const [filters, setFilters] = useState({
    genreId: "0",
    rating: "-1",
    sortBy: "popularity.desc",
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fetchMoviesRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const fetchMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
        params: {
          api_key: localStorage.getItem("apiKey"),
          page,
          with_genres: filters.genreId !== "0" ? filters.genreId : undefined,
          "vote_average.gte": filters.rating !== "-1" ? parseInt(filters.rating) : undefined,
          sort_by: filters.sortBy,
          language: "ko-KR",
        },
      });

      const newMovies = response.data.results;

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => [
          ...prevMovies,
          ...newMovies.filter(
            (movie: Movie) =>
              !prevMovies.some((existingMovie: Movie) => existingMovie.id === movie.id)
          ),
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page, loading, hasMore]);

  fetchMoviesRef.current = fetchMovies;

  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
    setMovies([]);
    setPage(1);
    setHasMore(true);

    fetchMoviesRef.current();
  }, [filters]);

  useEffect(() => {
    fetchMoviesRef.current();
  }, [page]);

  const toggleWishlist = (movie: Movie) => {
    const exists = wishlist.some((item) => item.id === movie.id);

    const updatedWishlist = exists
      ? wishlist.filter((item) => item.id !== movie.id)
      : [...wishlist, movie];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container!;
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateFilters = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="search-page" ref={scrollContainerRef}>
      <div className="filter-options">
        <select onChange={(e) => updateFilters("genreId", e.target.value)}>
          <option value="0">장르 (전체)</option>
          <option value="28">액션</option>
          <option value="27">공포</option>
          <option value="35">코미디</option>
          <option value="10751">어린이</option>
          <option value="10749">로맨스</option>
        </select>

        <select onChange={(e) => updateFilters("rating", e.target.value)}>
          <option value="-1">평점 (전체)</option>
          <option value="6">6점 이상</option>
          <option value="7">7점 이상</option>
          <option value="8">8점 이상</option>
          <option value="9">9점 이상</option>
        </select>

        <select onChange={(e) => updateFilters("sortBy", e.target.value)}>
          <option value="popularity.desc">인기순</option>
          <option value="vote_average.desc">평점순</option>
          <option value="release_date.desc">최신순</option>
        </select>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
            key={`movie-${movie.id}`}
            className={`movie-item ${wishlist.some((item) => item.id === movie.id) ? "highlighted" : ""}`}
            onClick={() => toggleWishlist(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
          </div>
        ))}
      </div>

      {loading && <div className="loading">로딩 중...</div>}

      <div className="wishlist-section">
        <h2>추천 영화 목록</h2>
        <div className="wishlist-grid">
          {wishlist.map((movie) => (
            <div key={movie.id} className="wishlist-item">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <button onClick={() => toggleWishlist(movie)}>제거</button>
            </div>
          ))}
        </div>
      </div>

      <button className="scroll-to-top" onClick={scrollToTop}>
        Top
      </button>
    </div>
  );
};

export default SearchPage;
