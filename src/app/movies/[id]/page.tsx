
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { fetchTMDB } from "../../lib/api";

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
  runtime?: number;
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
        const data = await fetchTMDB(`movie/${id}`, { append_to_response: "credits,images,videos,reviews" });
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
    <main className="min-h-screen bg-gradient-to-b from-[#18122B] to-[#23213A] py-8 flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-8 bg-[#23213A] rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="flex-shrink-0">
          {movie.poster_path ? (
            <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width={320} height={480} className="rounded-lg object-cover shadow-lg" />
          ) : (
            <div className="w-80 h-[480px] bg-gray-700 flex items-center justify-center text-gray-400 rounded-lg shadow-lg">No Image</div>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
          {movie.tagline && <p className="italic text-purple-400 mb-2">{movie.tagline}</p>}
          <div className="flex gap-4 text-gray-400 text-sm mb-2">
            <span>Release: {movie.release_date}</span>
            <span>Rating: <span className="text-yellow-400 font-semibold">{movie.vote_average}</span></span>
            {movie.runtime && <span>Runtime: {movie.runtime} min</span>}
          </div>
          {movie.genres && (
            <div className="flex gap-2 flex-wrap mb-2">
              {movie.genres.map(g => (
                <span key={g.id} className="px-2 py-1 bg-blue-700 text-white rounded text-xs">{g.name}</span>
              ))}
            </div>
          )}
          {movie.production_companies && (
            <div className="text-xs text-gray-400 mb-2">Production: {movie.production_companies.map((c) => c.name).join(", ")}</div>
          )}
          {movie.credits && movie.credits.cast && (
            <div className="text-xs text-gray-400 mb-2">Cast: {movie.credits.cast.slice(0, 5).map((c) => c.name).join(", ")}</div>
          )}
          {movie.credits && movie.credits.crew && (
            <div className="text-xs text-gray-400 mb-2">Director: {movie.credits.crew.filter((c) => c.job === "Director").map((c) => c.name).join(", ")}</div>
          )}
          <p className="text-gray-300 text-base mb-2">{movie.overview}</p>
          {movie.videos && movie.videos.results && movie.videos.results.length > 0 && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.videos.results[0].key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded transition-all shadow w-fit mt-2"
            >
              Watch Trailer
            </a>
          )}
          {movie.reviews && movie.reviews.results && movie.reviews.results.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-bold text-white mb-1">Top Review:</h3>
              <p className="text-gray-300 text-xs italic">{movie.reviews.results[0].content}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
