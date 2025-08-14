
// All TMDB requests go through the serverless proxy
export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
	const search = new URLSearchParams({ endpoint, ...params }).toString();
	const url = `/api/tmdb?${search}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch from proxy');
	return res.json();
}
