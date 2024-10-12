"use server";

import { SearchForMoviesRequest } from "@/libs/schema";

export type Movie = {
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
};

export default async function searchFormMovies({
  page,
  releaseDateGreaterThan,
  releaseDateLessThan,
  sortBy,
  voteAverageGreaterThan,
  voteAverageLessThan,
  voteCountGreaterThan,
  voteCountLessThan,
  withGenres,
  withoutGenres,
  year,
}: SearchForMoviesRequest) {
  "use server";
  console.log("Request received for search-for-movies action");

  console.log("genreIds: ", withGenres);

  // transform genreIds from an array of numbers to a string with | between each number
  let genreIdsString = "";
  if (withGenres) {
    genreIdsString = withGenres.join(",");
  }

  // transform sortBy from camelCase to snake_case
  let sortByString = "";
  if (sortBy) {
    sortByString = sortBy.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  if (!voteCountGreaterThan) {
    voteCountGreaterThan = 100;
  }

  try {
    let url = new URL(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US`,
    );

    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (releaseDateGreaterThan) {
      url.searchParams.append(
        "release_date.gte",
        releaseDateGreaterThan.toISOString(),
      );
    }
    if (releaseDateLessThan) {
      url.searchParams.append(
        "release_date.lte",
        releaseDateLessThan.toISOString(),
      );
    }
    if (sortBy) {
      url.searchParams.append("sort_by", sortByString);
    }
    if (voteAverageGreaterThan) {
      url.searchParams.append(
        "vote_average.gte",
        voteAverageGreaterThan.toString(),
      );
    }
    if (voteAverageLessThan) {
      url.searchParams.append(
        "vote_average.lte",
        voteAverageLessThan.toString(),
      );
    }
    if (voteCountGreaterThan) {
      url.searchParams.append(
        "vote_count.gte",
        voteCountGreaterThan.toString(),
      );
    }
    if (voteCountLessThan) {
      url.searchParams.append("vote_count.lte", voteCountLessThan.toString());
    }
    if (withGenres) {
      url.searchParams.append("with_genres", genreIdsString);
    }
    if (withoutGenres) {
      url.searchParams.append("without_genres", genreIdsString);
    }
    if (year) {
      url.searchParams.append("year", year.toString());
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

    console.log("data: ", data);

    const movies = data.results.map((movie: any) => {
      return {
        // adult: movie.adult,
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
