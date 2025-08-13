import { NextResponse } from 'next/server';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

console.log("TMDB_API_KEY:", TMDB_API_KEY);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
  }

  // Collect all other search params
  const params = Array.from(searchParams.entries())
    .filter(([key]) => key !== 'endpoint')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = `${TMDB_API_BASE}/${endpoint}?api_key=${TMDB_API_KEY}${params ? `&${params}` : ''}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      // Return TMDB error message for easier debugging
      return NextResponse.json({ error: data.status_message || 'TMDB error', status_code: data.status_code }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch TMDB data', details: String(err) }, { status: 500 });
  }
}
