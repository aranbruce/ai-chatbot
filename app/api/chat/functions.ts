import type { ChatCompletionCreateParams } from 'openai/resources/chat';

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "search_the_web",
    description:
      "Search the web for information on a given topic or for a specific query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to search the web for",
        },
        country: {
          type: "string",
          description: "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.",
          enum: [
            "AR",
            "AU",
            "AT",
            "BE",
            "BR",
            "CA",
            "CL",
            "DK",
            "FI",
            "FR",
            "DE",
            "HK",
            "IN",
            "ID",
            "IT",
            "JP",
            "KR",
            "MY",
            "MX",
            "NL",
            "NZ",
            "NO",
            "CN",
            "PL",
            "PT",
            "PH",
            "RU",
            "SA",
            "ZA",
            "ES",
            "SE",
            "CH",
            "TW",
            "TH",
            "TR",
            "GB",
            "US",
          ],
        },
        freshness: {
          type: "string",
          description: "The freshness of the search results. This filters search results by when they were discovered.",
          enum: ["past-day", "past-week", "past-month", "past-year"],
        },
        units: {
          type: "string",
          description: "This filters search results by the units of measurement. The units string is limited to metric or imperial. Units should be used for search queries that require units of measurement, such as distance or temperature.",
          enum: ["metric", "imperial"],
        }
      },
      required: ["query"],
    },
  },
  {
    name: "get_news",
    description:
      "Search for news on the web for a given topic",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query or topic to search for news on",
        },
        country: {
          type: "string",
          description: "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.",
          enum: [
            "AR",
            "AU",
            "AT",
            "BE",
            "BR",
            "CA",
            "CL",
            "DK",
            "FI",
            "FR",
            "DE",
            "HK",
            "IN",
            "ID",
            "IT",
            "JP",
            "KR",
            "MY",
            "MX",
            "NL",
            "NZ",
            "NO",
            "CN",
            "PL",
            "PT",
            "PH",
            "RU",
            "SA",
            "ZA",
            "ES",
            "SE",
            "CH",
            "TW",
            "TH",
            "TR",
            "GB",
            "US",
          ],
        },
        freshness: {
          type: "string",
          description: "The freshness of the search results. This filters search results by when they were discovered.",
          enum: ["past-day", "past-week", "past-month", "past-year"],
        },
        units: {
          type: "string",
          description: "This filters search results by the units of measurement. The units string is limited to metric or imperial. Units should be used for search queries that require units of measurement, such as distance or temperature.",
          enum: ["metric", "imperial"],
        }
      },
      required: ["query"],
    },
  },
  {
    name: "get_current_weather",
    description:
      "Search for the current weather for a given place or location",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The place or location to search for the current weather",
        },
        units: {
          type: "string",
          description: "The units of measurement for the weather data. The units string is limited to metric or imperial.",
          enum: ["metric", "imperial"],
        }
      },
      required: ["query"],
    },
  },
  {
    name: "get_weather_forecast",
    description:
      "Get the weather forecast for a given place or location",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The place or location to search for the weather forecast",
        },
        units: {
          type: "string",
          description: "The units of measurement for the weather data. The units string is limited to metric or imperial.",
          enum: ["metric", "imperial"],
        },
        forecast_days: {
          type: "number",
          description: "The number of days to forecast the weather for",
        },
        interval: {
          type: "string",
          description: "The interval of the weather forecast data. The interval string is limited to hourly, every three hours, every six hours, every twelve hours and daily.",
          enum: ["hourly", "every-three-hours", "every-six-hours", "every-twelve-hours", "daily"],
        }
      },
      required: ["query"],
    },
  }
];

async function search_the_web(query: string, country?: string, freshness?: string, units?: string) {
  try {
    const response = await fetch(`${process.env.URL}/api/web-search?query=${query}` +
      (country ? `&country=${country}` : '') +
      (freshness ? `&freshness=${freshness}` : '') +
      (units ? `&units=${units}` : ''),
      {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

async function get_news(query: string, country?: string, freshness?: string, units?: string) {
  try {
    const response = await fetch(`${process.env.URL}/api/news-search?query=${query}` +
      (country ? `&country=${country}` : '') +
      (freshness ? `&freshness=${freshness}` : '') +
      (units ? `&units=${units}` : ''),
      {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

async function get_current_weather(query: string, units?: string) {
  try {
    const response = await fetch(`${process.env.URL}/api/get-weather?query=${query}` +
      (units ? `&units=${units}` : ''),
      {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

async function get_weather_forecast(query: string, units?: string, forecast_days?: number, interval?: string) {
  try {
    const response = await fetch(`${process.env.URL}/api/weather-forecast?query=${query}` +
      (units ? `&units=${units}` : '') +
      (forecast_days ? `&forecast_days=${forecast_days}` : '') +
      (interval ? `&interval=${interval}` : ''),
      {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_the_web":
      return await search_the_web(args["query"], args["country"], args["freshness"], args["units"]);
    case "get_news":
      return await get_news(args["query"], args["country"], args["freshness"], args["units"]);
    case "get_current_weather":
      return await get_current_weather(args["query"], args["units"]);
    case "get_weather_forecast":
      return await get_weather_forecast(args["query"], args["units"], args["forecast_days"], args["interval"]);
    default:
      return null;
  }
}