"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useSearch } from "./context/SearchContext";
import MovieList from "./components/MovieList";
import MovieCard from "./components/MovieCard";

// Movie type definition for local use
type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

// Avatar movie detail type for modal
type AvatarMovieDetail = Movie & {
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

export default function Home() {
  const { searchQuery } = useSearch();
  const [avatarInfo, setAvatarInfo] = useState<AvatarMovieDetail | null>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  useEffect(() => {
    // Fetch Avatar movie info from TMDB (id: 19995)
    fetch(`/api/tmdb?endpoint=movie/19995&append_to_response=credits,images,videos,reviews`)
      .then(res => res.json())
      .then(data => setAvatarInfo(data));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18122B] to-[#23213A]">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-start h-[60vh] px-8 pt-12 pb-8 bg-cover bg-center" style={{backgroundImage: "url('https://image.tmdb.org/t/p/original/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#18122B]/90 to-[#23213A]/60 z-0" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Avatar</h1>
          <p className="text-lg text-gray-200 mb-6 drop-shadow">
            In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded transition-all shadow focus:outline-none cursor-pointer">Watch Trailer</button>
            <button
              className="bg-black/80 hover:bg-black text-white font-bold px-6 py-2 rounded border border-gray-400 transition-all shadow focus:outline-none cursor-pointer"
              onClick={() => setAvatarModalOpen(true)}
            >
              More Info
            </button>
          </div>
        </div>
      </section>

      {/* Avatar More Info Modal */}
      {avatarModalOpen && avatarInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#23213A] rounded-xl shadow-2xl p-8 max-w-2xl w-full relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl" onClick={() => setAvatarModalOpen(false)}>&times;</button>
            <div className="flex gap-8">
              {avatarInfo.poster_path ? (
                <Image src={`https://image.tmdb.org/t/p/w300${avatarInfo.poster_path}`} alt="Avatar Poster" width={160} height={240} className="rounded-lg w-40 h-60 object-cover" />
              ) : (
                <div className="w-40 h-60 bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg">No Image</div>
              )}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white mb-2">{avatarInfo.title}</h2>
                <div className="flex gap-4 text-gray-400 text-sm mb-2">
                  <span>Release: {avatarInfo.release_date}</span>
                  <span>Rating: <span className="text-yellow-400 font-semibold">{avatarInfo.vote_average}</span></span>
                  {avatarInfo.runtime && <span>Runtime: {avatarInfo.runtime} min</span>}
                </div>
                {avatarInfo.genres && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {avatarInfo.genres && avatarInfo.genres.map((g) => (
                      <span key={g.id} className="px-2 py-1 bg-blue-700 text-white rounded text-xs">{g.name}</span>
                    ))}
                  </div>
                )}
                <p className="text-gray-300 text-base mb-2">{avatarInfo.overview}</p>
                {avatarInfo.tagline && <p className="italic text-purple-400 mb-2">{avatarInfo.tagline}</p>}
                {avatarInfo.production_companies && (
                  <div className="text-xs text-gray-400 mb-2">Production: {avatarInfo.production_companies.map((c) => c.name).join(", ")}</div>
                )}
                {avatarInfo.credits && avatarInfo.credits.cast && (
                  <div className="text-xs text-gray-400 mb-2">Cast: {avatarInfo.credits.cast.slice(0, 5).map((c) => c.name).join(", ")}</div>
                )}
                {avatarInfo.credits && avatarInfo.credits.crew && (
                  <div className="text-xs text-gray-400 mb-2">Director: {avatarInfo.credits.crew.filter((c) => c.job === "Director").map((c) => c.name).join(", ")}</div>
                )}
                {avatarInfo.videos && avatarInfo.videos.results && avatarInfo.videos.results.length > 0 && (
                  <a
                    href={`https://www.youtube.com/watch?v=${avatarInfo.videos.results[0].key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition-all shadow w-fit mt-2"
                  >
                    Watch Trailer
                  </a>
                )}
                {avatarInfo.reviews && avatarInfo.reviews.results && avatarInfo.reviews.results.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-sm font-bold text-white mb-1">Top Review:</h3>
                    <p className="text-gray-300 text-xs italic">{avatarInfo.reviews.results[0].content}</p>
                  </div>
                )}
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
function DefaultMovieTabs() {
  const [tab, setTab] = useState<'popular' | 'trending'>('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        let moviesData = [];
        let total = 1;
        let url = "";
        if (tab === "popular") {
          url = `/api/tmdb?endpoint=movie/popular&language=en-US&page=${page}`;
        } else {
          url = `/api/tmdb?endpoint=trending/movie/week&page=${page}`;
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
        moviesData = data.results;
        total = data.total_pages || 1;
        setMovies(moviesData);
        setTotalPages(total);
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
      movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          posterUrl={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined}
          title={movie.title}
          year={movie.release_date ? movie.release_date.slice(0, 4) : ""}
          rating={movie.vote_average}
          description={movie.overview}
        />
      ))
    ), [movies]);

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
        </div>
      </div>
      {/* Movie Cards Row */}
      <div className="flex flex-wrap gap-8 justify-center">
        {error ? (
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
    </>
  );
}
