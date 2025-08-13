import Image from "next/image";
// MovieCard component skeleton
type MovieCardProps = {
  posterUrl?: string;
  title: string;
  year: string;
  rating: number;
  description: string;
};

export default function MovieCard({ posterUrl, title, year, rating, description }: MovieCardProps) {
  return (
    <div className="bg-[#23213A] rounded-xl shadow-lg overflow-hidden flex flex-col w-56 min-h-[400px] transition-transform hover:scale-105">
      <div className="h-80 w-full bg-[#18122B] flex items-center justify-center">
          {posterUrl ? (
            <Image src={posterUrl} alt={title} width={224} height={320} className="object-cover w-full h-full" />
          ) : (
            <div className="text-gray-500">No Image</div>
          )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-white truncate">{title}</h3>
          <span className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
            <svg width="16" height="16" fill="currentColor" className="inline-block"><path d="M8 12.472l-4.472 2.35.855-4.99L1 6.763l5.014-.728L8 1.5l1.986 4.535L15 6.763l-3.383 3.07.855 4.99z"/></svg>
            {rating}
          </span>
        </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
              {year}
            </div>
        <p className="text-gray-300 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
