import {
  GetCoordinatesFromLocationRequest,
  GetLocationFromCoordinatesRequest,
} from "@/libs/schema";

export default async function getLocationFromCoordinates({
  latitude,
  longitude,
}: GetLocationFromCoordinatesRequest) {
  try {
    console.log("Request received for get-location-from-coordinates action");

    const url = new URL(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&limit=1`,
    );

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

    const data = await response.json();
    const location = data[0].name;
    const country = data[0].country;

    return {
      location: location,
      country: country,
    } as GetCoordinatesFromLocationRequest;
  } catch (error) {
    console.error("Error:", error);
    return { error: "Error occurred" };
  }
}
