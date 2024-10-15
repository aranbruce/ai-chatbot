import { Movie } from "@/components/movie-card/movie-card";
import MovieCard from "./movie-card";

export default function MovieCardGroup({ movies }: { movies: Movie[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-row gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
          />
        </svg>
        <h3 className="text-base font-semibold">Movies</h3>
      </div>
      <div className="flex snap-x snap-proximity space-x-4 overflow-x-scroll">
        {movies.map((movie: Movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            adult={movie.adult}
            title={movie.title}
            backdropPath={movie.backdropPath}
            genreIds={movie.genreIds}
            overview={movie.overview}
            popularity={movie.popularity}
            posterPath={movie.posterPath}
            releaseDate={movie.releaseDate}
            voteAverage={movie.voteAverage}
            voteCount={movie.voteCount}
            originalLanguage={""}
            originalTitle={""}
            video={false}
          />
        ))}
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
  );
}
