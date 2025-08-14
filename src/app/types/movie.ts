// Movie and User types skeleton
export type Movie = {
	id: number;
	posterUrl?: string;
	title: string;
	year?: string;
	rating?: number;
	description?: string;
	poster_path?: string | null;
	release_date?: string;
	vote_average?: number;
	overview?: string;
};
export type User = object;
