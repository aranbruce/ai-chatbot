"use server";

import { GetCoordinatesFromLocationRequest } from "@/libs/schema";

export default async function getCoordinatesFromLocation({
  location,
  countryCode,
}: GetCoordinatesFromLocationRequest) {
  "use server";
  try {
    console.log("Request received for get-coordinates-from-location action");

    const url = new URL(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`,
    );

    if (countryCode) {
      url.searchParams.append("country", countryCode);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
      },
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
    return { error: "Error occurred" };
  }
}
