// Create an api that returns a credit file for a next.js app

import { NextRequest, NextResponse } from "next/server"; 

export async function GET(request: NextRequest) {
  console.log('GET request received for the weather-forecast route')

  // get the parameters from the query string of the request
  const location = request.nextUrl.searchParams.get('location')
  const units = request.nextUrl.searchParams.get('units')
  let forecast_days = parseInt(request.nextUrl.searchParams.get('forecast_days') || '0');

  console.log('location:', location)
  console.log('units:', units)
  console.log('forecast_days:', forecast_days)

  if (!location) {
    return NextResponse.json({error: 'A location is required'}, { status: 400 })
  }
  
  if (units && !['metric', 'imperial'].includes(units)) {
    return NextResponse.json({error: 'Invalid units parameter'}, { status: 400 })
  }

  if (forecast_days < 1 || forecast_days > 21){
    return NextResponse.json({error: 'Invalid forecast_days parameter'}, { status: 400 })
  }
  
    
  // Get the location from the query
  const getCoordinates = async (query: string) => {
    try {
      let url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
      const headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
      };
      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const latitude: number = data[0].lat;
      const longitude: number = data[0].lon;
      return { 
        latitude: latitude,
        longitude: longitude 
      };

    } catch (error) {
      console.error('Error:', error);
      return new NextResponse('Error occurred', { status: 500 });
    }
  }
  
  // call OpenWeather API using the location
  const coordinates = await getCoordinates(location);
  
  try {    
    if (typeof coordinates !== 'object' || coordinates === null || !('latitude' in coordinates) || !('longitude' in coordinates)) {
      return NextResponse.json({error: 'Invalid location'}, { status: 400 });
    }
    
    let baseUrl = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.OPENWEATHER_API_KEY}`;

    if (units) {
      baseUrl += `&units=${units}`;
    }
    // Call the OpenWeather API to get the weather forecast for each day in the forecast_days
    let forecast = [];
    for (let i = 0; i < forecast_days; i++) {
      const today = new Date();
      // increment the date by i days
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const url = baseUrl + `&date=${date.toISOString().split('T')[0]}`

      const headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
      };
      const res = await fetch(url, {
        method: "GET",
        headers: headers
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.json();
      // add the day number to the response
      response.day = i + 1;
      // add response to forecast array
      forecast.push(response);
    }
    return NextResponse.json(forecast, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({error: `Error occurred: ${error}`}, { status: 500 });
  }
}