"use server";

interface Request {
  query: string;
  limit?: number;
  offset?: number;
  rating?: string;
}

export default async function search_for_gifs({
  query,
  limit = 5,
  offset,
  rating,
}: Request) {
  "use server";
  console.log("Request received for search_for_gifs action");
  console.log("Query:", query);
  console.log("Offset:", offset);
  console.log("Limit:", limit);

  // call giphy API
  let url = new URL(
    `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=${limit}&rating=g&lang=en&bundle=messaging_non_clips`,
  );
  if (limit) {
    url.searchParams.append("limit", limit.toString());
  }
  if (rating) {
    url.searchParams.append("rating", rating);
  }
  if (offset) {
    url.searchParams.append("offset", offset.toString());
  }

  const headers = {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
