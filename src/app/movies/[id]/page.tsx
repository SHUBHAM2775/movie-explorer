
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
  runtime?: number;
};

export default function MovieDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError("");
      try {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!apiKey) {
          setError("TMDB API key not set.");
          setLoading(false);
          return;
        }
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMovie(data);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "message" in err) {
          setError((err as { message?: string }).message || "Failed to fetch movie details");
        } else {
          setError("Failed to fetch movie details");
        }
      }
      setLoading(false);
    }
    if (id) fetchMovie();
  }, [id]);

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!movie) return <div className="text-white p-8">Movie not found.</div>;

  return (
    <main className="min-h-screen bg-[#18122B] py-8 flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-8 bg-[#23213A] rounded-xl shadow-lg p-8 w-full max-w-4xl">
        <div className="flex-shrink-0">
          {movie.poster_path ? (
            <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={320} height={480} className="rounded-lg object-cover" />
          ) : (
            <div className="w-80 h-[480px] bg-gray-700 flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          <div className="flex gap-4 text-gray-400 text-sm">
            <span>Release: {movie.release_date}</span>
            <span>Rating: <span className="text-yellow-400 font-semibold">{movie.vote_average}</span></span>
            {movie.runtime && <span>Runtime: {movie.runtime} min</span>}
          </div>
          {movie.genres && (
            <div className="flex gap-2 flex-wrap">
              {movie.genres.map(g => (
                <span key={g.id} className="px-2 py-1 bg-blue-700 text-white rounded text-xs">{g.name}</span>
              ))}
            </div>
          )}
          <p className="text-gray-300 text-base mt-2">{movie.overview}</p>
        </div>
      </div>
    </main>
  );
}
