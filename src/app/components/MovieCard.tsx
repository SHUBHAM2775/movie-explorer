"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../hooks/useFavorites";

type MovieCardProps = {
  id: number;
  posterUrl?: string;
  title: string;
  year?: string;
  rating?: number;
  description?: string;
  onClick?: () => void;
};

export default function MovieCard({ id, posterUrl, title, year, rating, description, onClick }: MovieCardProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/movies/${id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick();
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite({ id, posterUrl, title, year, rating, description });
    }
  };

  return (
    <div className={`bg-[#23213A] rounded-xl shadow-lg overflow-hidden flex flex-col w-56 min-h-[400px] transition-transform hover:scale-105 ${theme === "dark" ? "bg-gray-900 text-yellow-400" : "bg-white text-black"}`}>
      <button
        className="h-80 w-full bg-[#18122B] flex items-center justify-center focus:outline-none"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`View details for ${title}`}
        tabIndex={0}
        type="button"
      >
        {posterUrl ? (
          <Image src={posterUrl} alt={title} width={224} height={320} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-80 bg-gray-700 flex items-center justify-center text-gray-400 rounded-t-xl">No Image</div>
        )}
      </button>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <button
            className={`text-lg font-bold truncate cursor-pointer hover:underline bg-transparent border-none p-0 m-0 ${theme === "dark" ? "text-white" : "text-black"}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`View details for ${title}`}
            tabIndex={0}
            type="button"
          >
            {title}
          </button>
          <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
            <svg width="16" height="16" fill="currentColor" className="inline-block"><path d="M8 12.472l-4.472 2.35.855-4.99L1 6.763l5.014-.728L8 1.5l1.986 4.535L15 6.763l-3.383 3.07.855 4.99z"/></svg>
            {rating}
          </span>
          <button
            className={`ml-2 text-yellow-400 cursor-pointer focus:outline-none bg-transparent border-none p-0 m-0 ${isFavorite(id) ? "" : "opacity-50"}`}
            aria-label={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
            onClick={handleFavorite}
            tabIndex={0}
            type="button"
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="inline-block"
              style={{ pointerEvents: "auto" }}
            >
              <path d="M10 15.472l-5.472 2.35.855-4.99L3 9.763l5.014-.728L10 4.5l1.986 4.535L17 9.763l-3.383 3.07.855 4.99z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
          {year}
        </div>
        <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
