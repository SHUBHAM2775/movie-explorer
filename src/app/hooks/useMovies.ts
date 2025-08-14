

import { useEffect, useState } from 'react';
import { fetchTMDB } from '../lib/api';
import { Movie } from '../types/movie';

export function useMovies(page: number = 1, language: string = 'en-US') {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchTMDB('movie/popular', { language, page: String(page) })
      .then(data => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch movies');
        setLoading(false);
      });
  }, [page, language]);

  return { movies, loading, error };
}
