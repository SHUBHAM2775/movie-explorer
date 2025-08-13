
"use client";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";

export default function MoviesPage() {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<main className="min-h-screen bg-[#18122B] py-8">
			<SearchBar onSearch={setSearchQuery} />
			<MovieList searchQuery={searchQuery} />
		</main>
	);
}
