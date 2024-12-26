import React, { useEffect, useState, useRef } from "react";
import { FaTable, FaList } from "react-icons/fa";
import "./PopularPage.css";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
}

const PopularPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "list">("list");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlist, setWishlist] = useState<Movie[]>([]);
  const [totalPages] = useState(10);
  const moviesPerPage = 16;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchMovies = async (page: number) => {
    setIsLoading(true);
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) {
      console.error("API 키가 없습니다. 로그인하세요.");
      return;
    }
    const baseUrl = "https://api.themoviedb.org/3/movie/popular";
    try {
      const response = await fetch(
        `${baseUrl}?api_key=${apiKey}&page=${page}&language=ko-KR`
      );
      const data = await response.json();
      setMovies((prev) => [...prev, ...data.results]);
    } catch (error) {
      console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);

    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, [page]);

  const toggleWishlist = (movie: Movie) => {
    const isInWishlist = wishlist.some((item) => item.id === movie.id);
    const updatedWishlist = isInWishlist
      ? wishlist.filter((item) => item.id !== movie.id)
      : [...wishlist, movie];

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const isMovieInWishlist = (movieId: number) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  const paginatedMovies = movies.slice(
    (page - 1) * moviesPerPage,
    page * moviesPerPage
  );

  return (
    <div
      className="popular-page"
      ref={scrollContainerRef}
      onScroll={() => {
        if (viewMode === "list") {
          const { scrollTop, clientHeight, scrollHeight } =
            scrollContainerRef.current!;
          if (
            scrollTop + clientHeight >= scrollHeight - 50 &&
            !isLoading &&
            page < totalPages
          ) {
            setPage((prev) => prev + 1);
          }
        }
      }}
    >
      <div className="view-selector-icons">
        <button
          className={`view-icon-button ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          <FaTable size={24} />
        </button>
        <button
          className={`view-icon-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <FaList size={24} />
        </button>
      </div>
      <div className={viewMode === "list" ? "movie-list" : "movie-table"}>
        {viewMode === "list"
          ? movies.map((movie) => (
              <div
                className={`movie-item-horizontal ${
                  isMovieInWishlist(movie.id) ? "highlighted" : ""
                }`}
                key={movie.id}
                onClick={() => toggleWishlist(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster-horizontal"
                />
                <div className="movie-details-horizontal">
                  <h3 className="movie-title-horizontal">{movie.title}</h3>
                  <p className="movie-description-horizontal">{movie.overview}</p>
                </div>
              </div>
            ))
          : paginatedMovies.map((movie) => (
              <div
                className={`movie-item-table ${
                  isMovieInWishlist(movie.id) ? "highlighted" : ""
                }`}
                key={movie.id}
                onClick={() => toggleWishlist(movie)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster-table"
                />
                <h3 className="movie-title-table">{movie.title}</h3>
              </div>
            ))}
      </div>
      {isLoading && <div className="loading">로딩 중...</div>}
      {viewMode === "list" && (
        <button
          className="top-button"
          onClick={() =>
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          맨 위로
        </button>
      )}
      {viewMode === "table" && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            이전
          </button>
          <span className="pagination-info">
            {page} / {totalPages}
          </span>
          <button
            className="pagination-button"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularPage;
