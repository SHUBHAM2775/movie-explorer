
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

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        // Use serverless proxy API
        const res = await fetch(`/api/tmdb?endpoint=movie/popular&page=${page}`);
        const data = await res.json();
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch {
        setMovies([]);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [page]);

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
