// Create an api that returns a credit file for a next.js app

import { NextRequest } from "next/server"; 

export async function GET(request: NextRequest) {

  // get the query from the query string of the request
  const query = request.nextUrl.searchParams.get('query')

  if (!query) {
    return new Response('A search query is required', { status: 400 })
  }  
  // call brave API
  const url = `https://api.search.brave.com/res/v1/web/search?q=${query}`;
  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
    "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || '',
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: headers
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const results = data.web.results
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error occurred', { status: 500 });
  }
}

