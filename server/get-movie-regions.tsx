export default async function getMovieRegions() {
  console.log("Request received for get-movie-regions action");

  try {
    const url = new URL(
      `https://api.themoviedb.org/3/watch/providers/regions?language=en-US`,
    );
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
