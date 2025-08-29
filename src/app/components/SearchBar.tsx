
import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchTMDB } from '../lib/api';
import { useRouter } from "next/navigation";
import Image from "next/image";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  type Movie = {
    id: number;
    poster_path: string | null;
    title: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
  const [results, setResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions from TMDB API
  const fetchSuggestions = async (search: string) => {
    if (!search) {
      setResults([]);
      return;
    }
      try {
        const data = await fetchTMDB('search/movie', { query: search });
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
  };

  // Handle input change with debounce
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(!!value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    onSearch(query.trim());
  };

  const handleSelect = (movie: Movie) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/movies/${movie.id}`);
  };

  return (
  <div className="relative w-full max-w-xl mx-auto mb-0 flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={user ? "Search movies..." : "Sign in to use search bar"}
          className={`px-4 py-2 rounded w-full bg-[#18122B] text-white border border-gray-700 focus:outline-none ${!user ? 'cursor-not-allowed' : ''}`}
          autoComplete="off"
          disabled={!user}
          style={!user ? { pointerEvents: 'none' } : undefined}
        />
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${user ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          disabled={!user}
          title={!user ? 'Sign in to search movies' : undefined}
        >
          Search
        </button>
      </form>
      {/* {!user && (
        <div className="text-xs text-yellow-400 mt-2 text-center">Sign in to use search features.</div>
      )} */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 bg-[#18122B] border border-gray-700 rounded mt-1 max-h-64 overflow-y-auto shadow-lg">
          {results.map(movie => (
            <li
              key={movie.id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-900 text-white flex items-center gap-2"
              onClick={() => handleSelect(movie)}
            >
              {movie.poster_path && (
                <Image src={`https://image.tmdb.org/t/p/w45${movie.poster_path}`} alt={movie.title} width={32} height={48} className="w-8 h-12 object-cover rounded" />
              )}
              <span>{movie.title} {movie.release_date ? `(${movie.release_date.slice(0,4)})` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
