import { Movie } from "@/server/search-for-movies";
import MovieCard from "./movie-card";

export function MovieCardGroup({ movies }: { movies: Movie[] }) {
  return (
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
  );
}
