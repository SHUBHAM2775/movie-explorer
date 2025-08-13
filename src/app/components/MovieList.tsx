
import { useEffect, useState, useMemo } from "react";
import MovieCard from "./MovieCard";

type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};


type MovieListProps = {
  searchQuery?: string;
};

export default function MovieList({ searchQuery }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        let url = "";
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("TMDB API key not set.");
          setMovies([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        if (searchQuery && searchQuery.length > 0) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchQuery)}&page=${page}&api_key=${apiKey}`;
        } else {
          url = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=${apiKey}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
          setMovies([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setError("Failed to fetch movies");
        setMovies([]);
        setTotalPages(1);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [page, searchQuery]);

  // Reset page to 1 when searchQuery changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const movieCards = useMemo(() => (
    movies.map((movie) => (
      <MovieCard
        key={movie.id}
        posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
        title={movie.title}
        year={movie.release_date ? movie.release_date.slice(0, 4) : ""}
        rating={movie.vote_average}
        description={movie.overview}
        id={movie.id}
      />
    ))
  ), [movies]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-8 justify-center mb-8 w-full">
        {error ? (
          <div className="text-red-500 text-center w-full mb-8">{error}</div>
        ) : loading ? (
          <div className="text-white">Loading...</div>
        ) : movieCards.length > 0 ? (
          movieCards
        ) : (
          <div className="text-white">No movies found.</div>
        )}
      </div>
      <div className="flex gap-4 mb-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Previous
        </button>
        <span className="text-white">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
