
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Only direct TMDB API calls, no proxy
export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
	if (!TMDB_API_KEY) throw new Error('TMDB API key not set');
	const search = new URLSearchParams({ api_key: TMDB_API_KEY, ...params }).toString();
	const url = `${TMDB_API_BASE}/${endpoint}?${search}`;
	return fetch(url).then(res => res.json());
}
