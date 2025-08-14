// TMDB API utility


export async function fetchPopularMovies() {
  const res = await fetch(`/api/tmdb?endpoint=movie/popular&language=en-US&page=1`);
  if (!res.ok) throw new Error('Failed to fetch movies');
  const data = await res.json();
  return data.results;
}
