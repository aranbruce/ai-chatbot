import { Movie } from "@/server/search-for-movies";
import Image from "next/image";

export default function MovieCard({
  id,
  title,
  backdropPath,
  genreIds,
  overview,
  popularity,
  posterPath,
  releaseDate,
  voteAverage,
  voteCount,
}: Movie) {
  return (
    <div className="relative flex min-w-80 snap-start flex-col items-start overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
      {backdropPath && (
        <>
          <div className="relative w-full">
            <img
              className="h-48 w-full object-cover"
              src={`https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces/${backdropPath}`}
              alt={title}
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <p className="absolute right-4 top-4 text-xs font-semibold text-white">
              {new Date(releaseDate).toLocaleDateString()}
            </p>
          </div>
        </>
      )}
      <div className="flex h-full w-full flex-col justify-between gap-3 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-2">
              <h3 className="line-clamp-2- w-full text-lg font-semibold">
                {title}
              </h3>
              <div className="flex flex-row items-center gap-1">
                <h4 className="font-semibold">{voteAverage.toFixed(1)}</h4>
                <p className="text-sm">({voteCount.toLocaleString()})</p>
              </div>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-1 text-sm dark:text-zinc-300"></div>
          </div>
          <p className="line-clamp-6 text-sm">{overview}</p>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          Provided by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-zinc-500 transition hover:text-zinc-300 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            The Movie Database
          </a>
        </p>
      </div>
    </div>
  );
}
