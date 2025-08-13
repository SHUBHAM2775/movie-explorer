"use client";
import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
// ...existing code...
// ...existing code...


// API key is handled in src/lib/api.ts

type Movie = {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

export default function Home() {
  const [tab, setTab] = useState<'popular' | 'trending'>('popular');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
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
        moviesData = data.results;
        total = data.total_pages || 1;
        setMovies(moviesData);
        setTotalPages(total);
      } catch {
        setMovies([]);
        setTotalPages(1);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [tab, page]);

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
            {/* Use Next.js Link for navigation */}
            <Link href="/movies/1" className="bg-black/80 hover:bg-black text-white font-bold px-6 py-2 rounded border border-gray-400 transition-all shadow focus:outline-none cursor-pointer">More Info</Link>
          </div>
        </div>
      </section>

      {/* Tabs and Favorites Button */}
      <div className="flex items-center justify-between px-8 mt-8 mb-4">
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
  {/* Login button removed from movie list area. Place in navbar or auth modal if needed. */}
  {/* Removed leftover closing tag from previous <a> to <Link> conversion */}
      </div>

      {/* Movie Cards Row */}
      <div className="px-8 pb-12">
        <div className="flex flex-wrap gap-8 justify-center">
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : movies && movies.length > 0 ? (
            movies.map((movie) => (
              <div className="w-56" key={movie.id}>
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={224}
                    height={320}
                    className="rounded-t-xl w-full h-80 object-cover"
                    priority={false}
                  />
                ) : null}
                <div className="bg-[#23213A] p-4 rounded-b-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">{movie.title}</span>
                    <span className="text-yellow-400 font-semibold text-sm flex items-center gap-1">
                      <svg width='16' height='16' fill='currentColor'><path d='M8 12.472l-4.472 2.35.855-4.99L1 6.763l5.014-.728L8 1.5l1.986 4.535L15 6.763l-3.383 3.07.855 4.99z'/></svg>{movie.vote_average}
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                    <svg width='14' height='14' fill='currentColor'><path d='M7 1a6 6 0 100 12A6 6 0 007 1zm0 10.8A4.8 4.8 0 117 2.2a4.8 4.8 0 010 9.6z'/><path d='M7 4.2a.7.7 0 01.7.7v2.1a.7.7 0 01-1.4 0V4.9A.7.7 0 017 4.2zm0 5.6a.7.7 0 100-1.4.7.7 0 000 1.4z'/></svg>{movie.release_date ? movie.release_date.slice(0, 4) : ""}
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
                </div>
              </div>
            ))
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
      </div>
    </div>
  );
}
