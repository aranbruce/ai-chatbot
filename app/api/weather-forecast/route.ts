// Create an api that returns a credit file for a next.js app

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("GET request received for the weather-forecast route");

  // get the parameters from the query string of the request
  const location = request.nextUrl.searchParams.get("location");
  let units = request.nextUrl.searchParams.get("units");
  const forecast_days = parseInt(
    request.nextUrl.searchParams.get("forecast_days") || "0"
  );

  console.log("location:", location);
  console.log("units:", units);
  console.log("forecast_days:", forecast_days);

  if (!location) {
    return NextResponse.json(
      { error: "A location is required" },
      { status: 400 }
    );
  }

  if (units && !["metric", "imperial"].includes(units)) {
    return NextResponse.json(
      { error: "Invalid units parameter" },
      { status: 400 }
    );
  }

  if (forecast_days < 1 || forecast_days >= 8) {
    return NextResponse.json(
      { error: "Invalid forecast_days parameter" },
      { status: 400 }
    );
  }

  // Get the location from the query
  const getCoordinates = async (query: string) => {
    try {
      const url = new URL(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
      );

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseJson = await response.json();
      const latitude: number = responseJson[0].lat;
      const longitude: number = responseJson[0].lon;

      return {
        latitude: latitude,
        longitude: longitude,
      };
    } catch (error) {
      console.error("Error:", error);
      return new NextResponse("Error occurred", { status: 500 });
    }
  };

  // call OpenWeather API using the location
  const coordinates = await getCoordinates(location);

  try {
    if (
      typeof coordinates !== "object" ||
      coordinates === null ||
      !("latitude" in coordinates) ||
      !("longitude" in coordinates)
    ) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    let url = new URL(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&exclude=current,minutely,hourly,alerts&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!units) {
      units = "metric";
    }
    url.searchParams.append("units", units);

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let responseJson = await response.json();
    // make the response array the same length as the forecast_days
    responseJson.daily = responseJson.daily.slice(0, forecast_days);

    responseJson = {
      lat: responseJson.lat,
      lon: responseJson.lon,
      timezone: responseJson.timezone,
      timezone_offset: responseJson.timezone_offset,
      location: location,
      daily: responseJson.daily.map((day: any, index: number) => ({
        dayIndex: index,
        temperatureMain: day.temp.day,
        temperatureMin: day.temp.min,
        temperatureMax: day.temp.max,
        weather: day.weather[0].main,
        units: units,
      })),
    };

    return Response.json(responseJson, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: `Error occurred: ${error}` },
      { status: 500 }
    );
  }
}
