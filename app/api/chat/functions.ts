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

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_the_web":
      return await search_the_web(args["query"], args["country"], args["freshness"], args["units"]);
    case "get_news":
      return await get_news(args["query"], args["country"], args["freshness"], args["units"]);
    default:
      return null;
  }
}