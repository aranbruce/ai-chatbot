import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("GET request received for gifs route");

  // get the parameters from the query string of the request
  const query = request.nextUrl.searchParams.get("query");
  const limit = request.nextUrl.searchParams.get("limit");
  const rating = request.nextUrl.searchParams.get("rating");

  if (!query) {
    return NextResponse.json(
      { error: "A search query is required" },
      { status: 400 }
    );
  }

  // call giphy API
  let url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}&limit=25&rating=g&lang=en&bundle=messaging_non_clips`;
  if (limit) {
    url += `&limit=${limit}`;
  }
  if (rating) {
    url += `&rating=${rating}`;
  }

  const headers = {
    Accept: "application/json",
    "Accept-Encoding": "gzip",
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: `Error occurred: ${error}` },
      { status: 500 }
    );
  }
}
