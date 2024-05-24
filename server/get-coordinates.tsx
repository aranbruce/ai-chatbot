"use server";

interface Request {
  location: string;
  countryCode?: string;
}

export default async function get_coordinates({
  location,
  countryCode,
}: Request) {
  "use server";
  try {
    console.log("Request received for get-coordinates action");
    console.log(
      `Requesting coordinates for ${location}: http://api.openweathermap.org/geo/1.0/direct?q=${location},${countryCode}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`,
    );
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      },
    );

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
