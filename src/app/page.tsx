"use client";

import { fetchTMDB } from './lib/api';
import { useState, useEffect, useMemo, useRef } from "react";
import { useSearch } from "./context/SearchContext";
import MovieList from "./components/MovieList";
import MovieCard from "./components/MovieCard";
import { useTheme } from "./context/ThemeContext";

// Movie type definition for local use
type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

export default function Home() {
  const { theme } = useTheme();
  const { searchQuery } = useSearch();
  // Featured movies for hero section
  const featuredMovies = [
    {
      title: "Inception",
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
      image: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      trailer: "https://www.youtube.com/watch?v=YoHD9XEInc0",
      release_date: "2010-07-16",
      rating: 8.8,
      genres: ["Action", "Sci-Fi", "Thriller"],
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
      director: "Christopher Nolan"
    },
    {
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      image: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
      trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
      release_date: "2014-11-07",
      rating: 8.6,
      genres: ["Adventure", "Drama", "Sci-Fi"],
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      director: "Christopher Nolan"
    },
    {
      title: "The Dark Knight",
      description: "When the menace known as the Joker emerges, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      image: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      trailer: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      release_date: "2008-07-18",
      rating: 9.0,
      genres: ["Action", "Crime", "Drama"],
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
      director: "Christopher Nolan"
    }
  ];
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredMovies.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [featuredMovies.length]);

  const movie = featuredMovies[current];

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gradient-to-b from-black to-gray-900 text-yellow-400" : "bg-gradient-to-b from-white to-yellow-50 text-black"}`}>
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-start h-[60vh] px-8 pt-12 pb-8 bg-cover bg-center" style={{backgroundImage: `url('${movie.image}')`}}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#18122B]/90 to-[#23213A]/60 z-0" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{movie.title}</h1>
          <p className="text-lg text-gray-200 mb-6 drop-shadow">{movie.description}</p>
          <div className="flex gap-4">
            <a href={movie.trailer} target="_blank" rel="noopener noreferrer">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded transition-all shadow focus:outline-none cursor-pointer">Watch Trailer</button>
            </a>
            <button
              className="bg-black/80 hover:bg-black text-white font-bold px-6 py-2 rounded border border-gray-400 transition-all shadow focus:outline-none cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* Hero More Info Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#23213A] rounded-xl shadow-2xl p-8 max-w-2xl w-full relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl" onClick={() => setModalOpen(false)}>&times;</button>
            <div className="flex gap-8">
              <img src={movie.image} alt={movie.title + " Poster"} width={160} height={240} className="rounded-lg w-40 h-60 object-cover" />
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                <div className="flex gap-4 text-gray-400 text-sm mb-2">
                  <span>Release: {movie.release_date}</span>
                  <span>Rating: <span className="text-yellow-400 font-semibold">{movie.rating}</span></span>
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {movie.genres.map((g) => (
                    <span key={g} className="px-2 py-1 bg-blue-700 text-white rounded text-xs">{g}</span>
                  ))}
                </div>
                <p className="text-gray-300 text-base mb-2">{movie.description}</p>
                <div className="text-xs text-gray-400 mb-2">Director: {movie.director}</div>
                <div className="text-xs text-gray-400 mb-2">Cast: {movie.cast.join(", ")}</div>
                <a
                  href={movie.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition-all shadow w-fit mt-2"
                >
                  Watch Trailer
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar is now in Navbar */}
      <div className="px-8 pb-12">
        {searchQuery ? (
          <MovieList searchQuery={searchQuery} />
        ) : (
          <DefaultMovieTabs />
        )}
      </div>
    </div>
  );
}

// Default tabs for popular/trending movies (original homepage logic)

import { useFavorites } from "./hooks/useFavorites";


function DefaultMovieTabs() {
  const [tab, setTab] = useState<'popular' | 'trending' | 'favorites'>('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>("");
  const { favorites } = useFavorites();
  // Force re-render on favorites change for fast load
  // useEffect(() => {
  //   setFavoritesVersion(v => v + 1);
  // }, [favorites]);

  useEffect(() => {
    if (tab === "favorites") return;
    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        let data;
        if (tab === "popular") {
          data = await fetchTMDB('movie/popular', { language: 'en-US', page: String(page) });
        } else {
          data = await fetchTMDB('trending/movie/week', { page: String(page) });
        }
        if (data.error) {
          setError(data.error);
          setMovies([]);
          setTotalPages(1);
          setLoading(false);
          return;
        }
        setMovies(data.results);
        setTotalPages(data.total_pages || 1);
      } catch {
        setError("Failed to fetch movies");
        setMovies([]);
        setTotalPages(1);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [tab, page]);

  const movieCards = useMemo(() => (
    (tab === "favorites" ? favorites : movies).map((movie: import("./types/movie").Movie) => (
      <MovieCard
        key={movie.id}
        id={movie.id}
        posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movie.posterUrl}
        title={movie.title}
        year={movie.release_date ? movie.release_date.slice(0, 4) : movie.year || ""}
        rating={movie.vote_average ?? movie.rating}
        description={movie.overview ?? movie.description}
      />
    ))
  ), [movies, favorites, tab]);

  return (
    <>
      {/* Tabs and Favorites Button */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 cursor-pointer ${tab === 'popular' ? 'bg-yellow-400 text-black focus:ring-yellow-400' : 'bg-transparent text-gray-300 hover:bg-[#23213A] focus:ring-purple-400'}`}
            onClick={() => setTab('popular')}
          >
            Popular
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 cursor-pointer ${tab === 'trending' ? 'bg-yellow-400 text-black focus:ring-yellow-400' : 'bg-transparent text-gray-300 hover:bg-[#23213A] focus:ring-purple-400'}`}
            onClick={() => setTab('trending')}
          >
            Trending
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 cursor-pointer ${tab === 'favorites' ? 'bg-yellow-400 text-black focus:ring-yellow-400' : 'bg-transparent text-gray-300 hover:bg-[#23213A] focus:ring-purple-400'}`}
            onClick={() => setTab('favorites')}
          >
            My Favorites
          </button>
        </div>
      </div>
      {/* Movie Cards Row */}
      <div className="flex flex-wrap gap-8 justify-center">
        {tab === "favorites" ? (
          favorites.length === 0 ? (
            <div className="text-gray-400">No favorite movies yet.</div>
          ) : (
            movieCards
          )
        ) : error ? (
          <div className="text-red-500 text-center w-full mb-8">{error}</div>
        ) : loading ? (
          <div className="text-white animate-pulse">Loading...</div>
        ) : movieCards.length > 0 ? (
          movieCards
        ) : (
          <div className="text-white">No movies found for this page.</div>
        )}
      </div>
      {/* Pagination Controls with numbered boxes */}
      {tab !== "favorites" && (
        <div className="flex justify-center mt-8 gap-2 items-center">
          <button
            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Prev
          </button>
          {/* Page number boxes logic */}
          {(() => {
            const pages = [];
            const maxPagesAhead = 3;
            const maxPagesBehind = 1;
            const start = Math.max(2, page - maxPagesBehind); // always show 1 separately
            const end = Math.min(totalPages - 1, page + maxPagesAhead); // always show last separately
            // First page
            pages.push(
              <button key={1} className={`px-3 py-2 rounded border cursor-pointer ${page === 1 ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`} onClick={() => setPage(1)} disabled={loading}>1</button>
            );
            // Ellipsis after first page if needed
            if (start > 2) pages.push(<span key="start-ellipsis" className="px-2 text-white">...</span>);
            // Middle pages
            for (let i = start; i <= end; i++) {
              pages.push(
                <button key={i} className={`px-3 py-2 rounded border cursor-pointer ${page === i ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`} onClick={() => setPage(i)} disabled={loading}>{i}</button>
              );
            }
            // Ellipsis before last page if needed
            if (end < totalPages - 1) pages.push(<span key="end-ellipsis" className="px-2 text-white">...</span>);
            // Last page
            if (totalPages > 1) {
              pages.push(
                <button key={totalPages} className={`px-3 py-2 rounded border cursor-pointer ${page === totalPages ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`} onClick={() => setPage(totalPages)} disabled={loading}>{totalPages}</button>
              );
            }
            return pages;
          })()}
          <button
            className="px-3 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={loading || (page === totalPages && (!movies || movies.length === 0))}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
