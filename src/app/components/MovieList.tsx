
import { useEffect, useState } from "react";
import { Suspense } from "react";
import LoadingSkeleton from "./LoadingSkeleton";
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

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        let url = "";
        if (searchQuery && searchQuery.length > 0) {
          url = `/api/tmdb?endpoint=search/movie&query=${encodeURIComponent(searchQuery)}&page=${page}`;
        } else {
          url = `/api/tmdb?endpoint=movie/popular&page=${page}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setMovies([]);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [page, searchQuery]);

  // Reset page to 1 when searchQuery changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="flex flex-col items-center">
        <div className="flex flex-wrap gap-8 justify-center mb-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
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
    </Suspense>
  );
}
