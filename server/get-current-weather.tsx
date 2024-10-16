import { GetCurrentWeatherRequest } from "@/libs/schema";
import getCoordinates from "./get-coordinates-from-location";

export default async function getCurrentWeather({
  location,
  countryCode,
  units,
}: GetCurrentWeatherRequest) {
  console.log("Request received for get-current-weather action");

  if (!units || (units !== "metric" && units !== "imperial")) {
    units = "metric";
  }

  // Get the coordinates from the location
  const { latitude, longitude } = await getCoordinates({
    location,
    countryCode,
  });

  try {
    const url = new URL(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&exclude=minutely,daily,alerts&units=${units}`,
    );
    const headers = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
    };
    console.log(`Requesting weather data from ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let responseJson = await response.json();

    responseJson = {
      location: location,
      countryCode: countryCode,
      currentHour: new Date().getHours(),
      currentDate: new Date().getTime(),
      units: units,
      current: {
        temp: Math.round(responseJson.current.temp),
        weather: responseJson.current.weather[0].main,
      },
      hourly: responseJson.hourly.map((hour: any) => ({
        temp: Math.round(hour.temp),
        weather: hour.weather[0].main,
      })),
    };
    return responseJson;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
