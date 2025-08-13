"use client";
import Link from "next/link";

import { useState } from "react";
// ...existing code...

const popularMovies = [
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    title: "Inception",
    year: "2010",
    rating: 8.3,
    description: "A thief who enters people's dreams to steal their secrets from their subconscious is given a chance to have his past crimes forgiven."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg",
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    description: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    title: "Interstellar",
    year: "2014",
    rating: 8.4,
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    title: "The Matrix",
    year: "1999",
    rating: 8.2,
    description: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth."
  },
];

const trendingMovies = [
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/ynXoOxmDHNQ4UAy0oU6avW71HVW.jpg",
    title: "Joker",
    year: "2019",
    rating: 8.5,
    description: "A mentally troubled stand-up comedian embarks on a downward spiral that leads to the creation of an iconic villain."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    title: "Avengers: Endgame",
    year: "2019",
    rating: 8.4,
    description: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    title: "La La Land",
    year: "2016",
    rating: 8.0,
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future."
  },
  {
    posterUrl: "https://image.tmdb.org/t/p/w500/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg",
    title: "John Wick",
    year: "2014",
    rating: 7.4,
    description: "An ex-hitman comes out of retirement to track down the gangsters that killed his dog and took everything from him."
  },
];

export default function Home() {
  const [tab, setTab] = useState<'popular' | 'trending'>('popular');
  const movies = tab === 'popular' ? popularMovies : trendingMovies;
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
          {movies.map((movie, idx) => (
            <div className="w-56" key={idx}>
              <img src={movie.posterUrl} alt={movie.title} className="rounded-t-xl w-full h-80 object-cover" />
              <div className="bg-[#23213A] p-4 rounded-b-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold">{movie.title}</span>
                  <span className="text-yellow-400 font-semibold text-sm flex items-center gap-1">
                    <svg width='16' height='16' fill='currentColor'><path d='M8 12.472l-4.472 2.35.855-4.99L1 6.763l5.014-.728L8 1.5l1.986 4.535L15 6.763l-3.383 3.07.855 4.99z'/></svg>{movie.rating}
                  </span>
                </div>
                <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                  <svg width='14' height='14' fill='currentColor'><path d='M7 1a6 6 0 100 12A6 6 0 007 1zm0 10.8A4.8 4.8 0 117 2.2a4.8 4.8 0 010 9.6z'/><path d='M7 4.2a.7.7 0 01.7.7v2.1a.7.7 0 01-1.4 0V4.9A.7.7 0 017 4.2zm0 5.6a.7.7 0 100-1.4.7.7 0 000 1.4z'/></svg>{movie.year}
                </div>
                <p className="text-gray-300 text-sm line-clamp-3">{movie.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
