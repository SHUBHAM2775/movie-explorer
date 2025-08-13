// TMDB API utility


export async function fetchPopularMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB API key not set.');
  const res = await fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${apiKey}`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  const data = await res.json();
  return data.results;
}
