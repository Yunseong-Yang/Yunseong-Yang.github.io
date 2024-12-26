import React, { useRef } from "react";
import "./styles/MovieRow.css";

interface Movie {
  id: number;
  poster_path: string;
  title: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  toggleWishlist: (movie: Movie) => void;
  isMovieInWishlist: (id: number) => boolean;
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  toggleWishlist,
  isMovieInWishlist,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.offsetWidth; // 한 번에 보이는 크기만큼 스크롤
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleEndScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      if (direction === "left" && rowRef.current.scrollLeft === 0) {
        rowRef.current.scrollLeft = rowRef.current.scrollWidth;
      } else if (
        direction === "right" &&
        rowRef.current.scrollLeft + rowRef.current.offsetWidth >=
          rowRef.current.scrollWidth
      ) {
        rowRef.current.scrollLeft = 0;
      }
    }
  };

  return (
    <div className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-container">
        <div className="movie-row-fade movie-row-fade-left" />
        <button
          className="movie-row-arrow movie-row-arrow-left"
          onClick={() => {
            handleScroll("left");
            handleEndScroll("left");
          }}
        >
          &lt;
        </button>
        <div className="movie-row-content" ref={rowRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-wrapper">
              <img
                src={movie.poster_path}
                alt={movie.title}
                className={`movie-poster ${
                  isMovieInWishlist(movie.id) ? "highlight" : ""
                }`}
                onClick={() => toggleWishlist(movie)}
              />
            </div>
          ))}
        </div>
        <button
          className="movie-row-arrow movie-row-arrow-right"
          onClick={() => {
            handleScroll("right");
            handleEndScroll("right");
          }}
        >
          &gt;
        </button>
        <div className="movie-row-fade movie-row-fade-right" />
      </div>
    </div>
  );
};

export default MovieRow;
