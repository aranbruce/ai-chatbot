import { Movie } from "@/components/movie-card/movie-card";
import {
  SearchForMoviesRequest,
  SearchForNowPlayingMoviesRequest,
} from "@/libs/schema";

export default async function searchForNowPlayingMovies({
  page,
  region,
}: SearchForNowPlayingMoviesRequest) {
  console.log("Request received for search-for-now-playing-movies action");

  try {
    let url = new URL(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US`,
    );
    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (region) {
      url.searchParams.append("region", region);
    }

    console.log(`Requesting movies from ${url}`);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();

    const movies = data.results.map((movie: any) => {
      return {
        backdropPath: movie.backdrop_path,
        genreIds: movie.genre_ids,
        id: movie.id,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        overview: movie.overview,
        popularity: movie.popularity,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        title: movie.title,
        video: movie.video,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
      };
    });

    return movies as Movie[];
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
