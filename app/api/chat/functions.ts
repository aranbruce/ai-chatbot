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
        location: {
          type: "string",
          description: "The place or location to search for the current weather",
        },
        units: {
          type: "string",
          description: "The units of measurement for the weather data. The units string is limited to metric or imperial.",
          enum: ["metric", "imperial"],
        }
      },
      required: ["location"],
    },
  },
  {
    name: "get_weather_forecast",
    description:
      "Get the weather forecast for a given place or location",
    parameters: {
      type: "object",
      properties: {
        location: {
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
      },
      required: ["location"],
    },
  },
  {
    name: "search_for_gifs",
    description:
      "Get popular gifs from giphy.com based on a search query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to search for gifs",
        },
        limit: {
          type: "number",
          description: "The number of gifs to return specified as an integer (int32) ranging from 1 to 50",
        },
        rating: {
          type: "string",
          description: "The rating of the gifs to return. The rating string is limited to g, pg, pg-13 or r. If no rating is specified results will be returned for all audiences.",
          enum: ["g", "pg", "pg-13", "r"],
        },
      },
      required: ["query"],
    }
  },
  {
    name: "search_for_movies",
    description:
      "Get movies from a database based on an input",
    parameters: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "A description of the type of movies to search for",
        },
        minimumIMDBRating: {
          type: "number",
          description: "The minimum IMDB rating of the movies to return",
        },
        minimumReleaseYear: {
          type: "number",
          description: "The minimum release year of the movies to return",
        },
        maximumReleaseYear: {
          type: "number",
          description: "The maximum release year of the movies to return",
        },
        director: {
          type: "string",
          description: "The director of the movies to return",
        },
        limit: {
          type: "number",
          description: "The number of movies to return specified as an integer (int32) ranging from 1 to 50. If no limit is specified, the default limit is 10.",
        },
      },
      required: ["input"],
    },
  },
  {
    name: "search_for_locations",
    description:
      "Get a list of locations from tripadvisor based on a query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "A description of the type of location to search for",
        },
        category: {
          type: "string",
          enum: ["hotels", "restaurants", "attractions", "geos"],
          description: "The type of locations to be searched for. The category string is limited to hotels, restaurants, attractions or geos.",
        },
        currency: {
          type: "string",
          description: "The currency to be used for the location details. The currency string is limited to 3 character currency codes following ISO 4217.",
        },
        
      },
      required: ["query"],
    },
  },
];

async function search_the_web(query: string, country?: string, freshness?: string, units?: string) {
  try {
    let url = `${process.env.URL}/api/web-search?query=${query}`
    if (country) {
      url += `&country=${country}`
    }
    if (freshness) {
      url += `&freshness=${freshness}`
    }
    if (units) {
      url += `&units=${units}`
    }
    const response = await fetch(url, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function get_news(query: string, country?: string, freshness?: string, units?: string) {
  try {
    let url = `${process.env.URL}/api/news-search?query=${query}`
    if (country) {
      url += `&country=${country}`
    }
    if (freshness) {
      url += `&freshness=${freshness}`
    }
    if (units) {
      url += `&units=${units}`
    }
    const response = await fetch(url, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

async function get_current_weather(location: string, units?: string) {
  try {
    let url = `${process.env.URL}/api/current-weather?location=${location}`
    if (units) {
      url += `&units=${units}`
    }
    const response = await fetch(url, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function get_weather_forecast(location: string, units?: string, forecast_days?: number) {
  try {
    let url = `${process.env.URL}/api/weather-forecast?location=${location}`
    if (units) {
      url += `&units=${units}`
    }
    if (forecast_days) {
      url += `&forecast_days=${forecast_days}`
    }
    const response = await fetch(url,{method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function search_for_gifs(query: string, limit?: number, rating?: string) {
  try {
    let url = `${process.env.URL}/api/gifs?query=${query}`;
    if (limit) {
      url += `&limit=${limit}`
    }
    if (rating) {
      url += `&rating=${rating}`
    }
    const response = await fetch(url, {method: "GET"});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function search_for_movies(input: string, minimumIMDBRating?: number, minimumReleaseYear?: number, maximumReleaseYear?: number, director?: string, limit?: number) {
  try {
    let url = `${process.env.URL}/api/movies-vector-db?input=${input}`;
    if (minimumIMDBRating) {
      url += `&minimumIMDBRating=${minimumIMDBRating}`
    }
    if (minimumReleaseYear) {
      url += `&minimumReleaseYear=${minimumReleaseYear}`
    }
    if (maximumReleaseYear) {
      url += `&maximumReleaseYear=${maximumReleaseYear}`
    }
    if (limit) {
      url += `&limit=${limit}`
    }
    if (director) {
      url += `&director=${director}`
    }

    const response = await fetch(url, {method: "GET"});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function search_for_locations(query: string, category?: string, currency?: string) {
  try {
    let url = `${process.env.URL}/api/location-search?query=${query}`;
    if (category) {
      url += `&category=${category}`
    }
    if (currency) {
      url += `&currency=${currency}`
    }
    const response = await fetch(url, {method: "GET"});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_the_web":
      return await search_the_web(args["query"], args["country"], args["freshness"], args["units"]);
    case "get_news":
      return await get_news(args["query"], args["country"], args["freshness"], args["units"]);
    case "get_current_weather":
      return await get_current_weather(args["location"], args["units"]);
    case "get_weather_forecast":
      return await get_weather_forecast(args["location"], args["units"], args["forecast_days"]);
    case "search_for_gifs":
      return await search_for_gifs(args["query"]);
    case "search_for_movies":
      return await search_for_movies(args["input"], args["minimumIMDBRating"], args["minimumReleaseYear"], args["maximumReleaseYear"], args["director"], args["limit"]);
    case "search_for_locations":
      return await search_for_locations(args["query"], args["category"], args["currency"]);
    default:
      return null;
  }
}