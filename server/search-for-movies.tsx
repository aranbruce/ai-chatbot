import { Movie } from "@/components/movie-card/movie-card";
import { SearchForMoviesRequest } from "@/libs/schema";

export default async function searchForMovies({
  page,
  region,
  minDate,
  maxDate,
  sortBy,
  voteAverageGreaterThan,
  voteAverageLessThan,
  voteCountGreaterThan,
  voteCountLessThan,
  withGenres,
  withoutGenres,
  year,
}: SearchForMoviesRequest) {
  console.log("Request received for search-for-movies action");
  console.log("region:", region);

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
    voteCountGreaterThan = 200;
  }

  try {
    let url = new URL(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US`,
    );
    if (page) {
      url.searchParams.append("page", page.toString());
    }
    if (region) {
      url.searchParams.append("region", region);
    }
    if (minDate) {
      url.searchParams.append("release_date.gte", minDate.toISOString());
    }
    if (maxDate) {
      url.searchParams.append("release_date.lte", maxDate.toISOString());
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
