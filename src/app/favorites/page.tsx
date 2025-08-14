"use client";

import { useFavorites } from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-gray-400">No favorite movies yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(movie => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </div>
  );
}
