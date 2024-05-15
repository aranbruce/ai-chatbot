import get_coordinates from "./get-coordinates";

interface Request {
  location: string;
  units?: "metric" | "imperial";
  forecast_days: number;
}

export default async function get_weather_forecast({
  location,
  units,
  forecast_days,
}: Request) {
  "use server";
  console.log("Request received for the weather-forecast action");

  if (!units) {
    units = "metric";
  }

  if (forecast_days < 1) {
    throw new Error("forecast_days must be at least 1");
  }
  if (forecast_days > 7) {
    throw new Error("forecast_days must be no more than 7");
  }

  const { latitude, longitude } = await get_coordinates({ location });

  try {
    const url = new URL(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${process.env.OPENWEATHER_API_KEY}&units=${units}`
    );

    const headers = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
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

    return responseJson;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
