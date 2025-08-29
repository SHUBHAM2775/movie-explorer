
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchTMDB } from '../lib/api';
import MovieCard from "./MovieCard";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";


type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

type MovieDetail = Movie & {
  runtime?: number;
  genres?: { id: number; name: string }[];
  tagline?: string;
  production_companies?: { id: number; name: string }[];
  credits?: {
    cast?: { name: string }[];
    crew?: { name: string; job: string }[];
  };
  videos?: {
    results?: { key: string }[];
  };
  reviews?: {
    results?: { content: string }[];
  };
};

type MovieListProps = {
  searchQuery?: string;
};

export default function MovieList({ searchQuery }: MovieListProps) {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      async function fetchMovies() {
        setLoading(true);
        setError("");
        try {
          let data;
          if (typeof searchQuery === "string" && searchQuery.length > 0) {
            data = await fetchTMDB('search/movie', { query: searchQuery, page: String(page) });
          } else {
            data = await fetchTMDB('movie/popular', { page: String(page) });
          }
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
    }, 350); // 350ms debounce
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [page, searchQuery]);

  // Reset page to 1 when searchQuery changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleCardClick = async (id: number) => {
    if (!user) return;
    setModalOpen(true);
    setSelectedMovie(null);
    try {
      const details = await fetchTMDB(`movie/${id}`, { append_to_response: 'credits,images,videos,reviews' });
      setSelectedMovie(details);
    } catch {
      setSelectedMovie(null);
    }
  };

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
        onClick={() => handleCardClick(movie.id)}
      />
    ))
  ), [movies, user]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center mb-8 w-full">
        {error ? (
          <div className="text-red-500 text-center w-full mb-8">{error}</div>
        ) : loading ? (
          <div className="text-white animate-pulse">Loading...</div>
        ) : movieCards.length > 0 ? (
          movieCards
        ) : (
          <div className="text-white">No movies found.</div>
        )}
        {!user && (
          <div className="text-xs text-yellow-400 w-full text-center mt-2">Sign in to view movie details.</div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 items-center justify-center w-full">
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

      {/* Movie Detail Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-2 sm:px-4">
          <div className="bg-[#23213A] rounded-xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full relative">
            <button className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-white text-xl" onClick={() => setModalOpen(false)}>&times;</button>
            {!selectedMovie ? (
              <div className="text-white animate-pulse">Loading...</div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                {selectedMovie.poster_path ? (
                  <Image src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`} alt="Movie Poster" width={160} height={240} className="rounded-lg w-32 h-48 sm:w-40 sm:h-60 object-cover" />
                ) : (
                  <div className="w-32 h-48 sm:w-40 sm:h-60 bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg">No Image</div>
                )}
                <div className="flex-1 flex flex-col gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-400 text-sm mb-2">
                    <span>Release: {selectedMovie.release_date}</span>
                    <span>Rating: <span className="text-yellow-400 font-semibold">{selectedMovie.vote_average}</span></span>
                    {selectedMovie.runtime && <span>Runtime: {selectedMovie.runtime} min</span>}
                  </div>
                  {selectedMovie.genres && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {selectedMovie.genres.map((g) => (
                        <span key={g.id} className="px-2 py-1 bg-blue-700 text-white rounded text-xs">{g.name}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-300 text-xs sm:text-base mb-2">{selectedMovie.overview}</p>
                  {selectedMovie.tagline && <p className="italic text-purple-400 mb-2">{selectedMovie.tagline}</p>}
                      {selectedMovie.production_companies && (
                        <div className="text-xs text-gray-400 mb-2">Production: {selectedMovie.production_companies.map((c: { id: number; name: string }) => c.name).join(", ")}</div>
                      )}
                      {selectedMovie.credits && selectedMovie.credits.cast && (
                        <div className="text-xs text-gray-400 mb-2">Cast: {selectedMovie.credits.cast.slice(0, 5).map((c: { name: string }) => c.name).join(", ")}</div>
                      )}
                      {selectedMovie.credits && selectedMovie.credits.crew && (
                        <div className="text-xs text-gray-400 mb-2">Director: {selectedMovie.credits.crew.filter((c: { name: string; job: string }) => c.job === "Director").map((c: { name: string; job: string }) => c.name).join(", ")}</div>
                      )}
                  {selectedMovie.videos && selectedMovie.videos.results && selectedMovie.videos.results.length > 0 && (
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedMovie.videos.results[0].key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition-all shadow w-fit mt-2"
                    >
                      Watch Trailer
                    </a>
                  )}
                  {selectedMovie.reviews && selectedMovie.reviews.results && selectedMovie.reviews.results.length > 0 && (
                    <div className="mt-2">
                      <h3 className="text-sm font-bold text-white mb-1">Top Review:</h3>
                      <p className="text-gray-300 text-xs italic">{selectedMovie.reviews.results[0].content}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
