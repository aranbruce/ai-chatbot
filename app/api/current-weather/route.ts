import { NextRequest, NextResponse } from "next/server"; 

export async function GET(request: NextRequest) {
  console.log('GET request received for current-weather route')

  // get the parameters from the location in the request
  const location = request.nextUrl.searchParams.get('location')
  const units = request.nextUrl.searchParams.get('units')

  if (!location) {
    return NextResponse.json({error: 'Missing location parameter'}, { status: 400 });
  }
  
  if (units && !['metric', 'imperial'].includes(units)) {
    return NextResponse.json({error: 'Invalid units parameter'}, { status: 400 });
  }

  // Get the longitude and latitude from the location
  const getCoordinates = async (query: string) => {
    try {
      let url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
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
      return NextResponse.json({error: `Error occurred: ${error}`}, { status: 500 });
    }
  }

  // call OpenWeather API using the location
  const coordinates = await getCoordinates(location);

  try {    
    if (typeof coordinates !== 'object' || coordinates === null || !('latitude' in coordinates) || !('longitude' in coordinates)) {
      return NextResponse.json({error: 'Invalid location'}, { status: 400 });
    }

    let url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.OPENWEATHER_API_KEY}`;
    
    if (units) {
      url += `&units=${units}`;
    }

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
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({error: `Error occurred: ${error}`}, { status: 500 });
  }
}

