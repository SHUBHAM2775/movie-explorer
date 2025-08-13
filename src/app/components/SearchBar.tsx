
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
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
      const res = await fetch(`/api/tmdb?endpoint=search/movie&query=${encodeURIComponent(search)}`);
      const data = await res.json();
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
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search movies..."
          className="px-4 py-2 rounded w-full bg-[#18122B] text-white border border-gray-700 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>
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
