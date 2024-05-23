import get_coordinates from "./get-coordinates";

interface Request {
  location: string;
  units?: "metric" | "imperial" | undefined;
}

export default async function get_current_weather({
  location,
  units,
}: Request) {
  "use server";
  console.log("Request received for get-current-weather action");

  if (!units || (units !== "metric" && units !== "imperial")) {
    units = "metric";
  }

  // Get the coordinates from the location
  const { latitude, longitude } = await get_coordinates({ location });

  try {
    const url = new URL(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHER_API_KEY}&exclude=minutely,daily,alerts&units=${units}`
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

    responseJson = {
      location: location,
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
