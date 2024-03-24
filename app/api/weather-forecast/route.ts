// Create an api that returns a credit file for a next.js app

import { NextRequest } from "next/server"; 

export async function GET(request: NextRequest) {
  console.log('GET request received for the weather-forecast route')

  // get the parameters from the query string of the request
  const query = request.nextUrl.searchParams.get('query')
  let units = request.nextUrl.searchParams.get('units')
  const forecast_days = request.nextUrl.searchParams.get('forecast_days')
  let interval = request.nextUrl.searchParams.get('interval')


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

  if (forecast_days && isNaN(parseInt(forecast_days))) {
    return new Response('Invalid forecast_days parameter', { status: 400 })
  }

  if (interval && !['hourly', 'every-three-hours', 'every-six-hours', 'every-twelve-hours', 'daily'].includes(interval)) {
    return new Response('Invalid interval parameter', { status: 400 })
  } else if (interval === "hourly") {
    interval = '1'
  } else if (interval === "every-three-hours") {
    interval = '3'
  } else if (interval === "every-six-hours") {
    interval = '6'
  } else if (interval === "every-twelve-hours") {
    interval = '12'
  } else if (interval === "daily") {
    interval = '24'
  }

  // call weatherstack API
  let url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${query}`;
  if (units) {
    url += `&units=${units}`;
  }
  if (forecast_days) {
    url += `&forecast_days=${forecast_days}`;
  }
  if (interval) {
    url += `&interval=${interval}`;
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
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error occurred', { status: 500 });
  }
}

