"use server";

export default async function getMovieGenres() {
  "use server";
  console.log("Request received for get-movie-genres action");

  try {
    const url = new URL(`https://api.themoviedb.org/3/genre/movie/list`);
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
    let result = await response.json();

    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
