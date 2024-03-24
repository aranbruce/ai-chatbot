import { NextRequest } from "next/server"; 

export async function GET(request: NextRequest) {
  console.log('GET request received for current-weather route')

  // get the parameters from the query string of the request
  const query = request.nextUrl.searchParams.get('query')
  let units = request.nextUrl.searchParams.get('units')

  console.log('query:', query)

  if (!query) {
    return new Response('A search query is required', { status: 400 })
  }
  
  if (units && !['metric', 'imperial'].includes(units)) {
    return new Response('Invalid units parameter', { status: 400 })
  } else if (units === "metric") {
    units = 'm'
  } else if (units === "imperial") {
    units = 'f'
  }

  // call weatherstack API
  let url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${query}`;
  if (units) {
    url += `&units=${units}`;
  }

  const headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip",
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
    const response = data.current;
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error occurred', { status: 500 });
  }
}

