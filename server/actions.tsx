"use server";

import { openai, createOpenAI } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

import { CoreMessage, streamObject, streamText } from "ai";
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";

import { z } from "zod";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import getCoordinates from "@/server/get-coordinates";
import getCurrentWeather from "@/server/get-current-weather";
import getWeatherForecast from "@/server/get-weather-forecast";
import searchTheWeb from "@/server/search-the-web";
import searchForImages from "./search-for-images";
import searchTheNews from "@/server/search-the-news";
import searchForLocations from "@/server/search-for-locations";
import searchForMovies from "@/server/search-for-movies";
import searchForGifs from "@/server/search-for-gifs";

import CurrentWeatherCard from "@/components/current-weather/current-weather-card";
import CurrentWeatherCardSkeleton from "@/components/current-weather/current-weather-card-skeleton";
import Spinner from "@/components/spinner";
import WebResultGroup from "@/components/web-results/web-result-group";
import WebResultCardGroupSkeleton from "@/components/web-results/web-result-group-skeleton";
import WeatherForecastCard from "@/components/weather-forecast/weather-forecast-card";
import WeatherForecastCardSkeleton from "@/components/weather-forecast/weather-forecast-card-skeleton";
import MovieCard, { MovieCardProps } from "@/components/movie-card/movie-card";
import LocationCardGroup from "@/components/location-card/location-card-group";
import LocationCardGroupSkeleton from "@/components/location-card/location-card-group-skeleton";
import MarkdownContainer from "@/components/markdown";
import ExampleMessageCardGroup from "@/components/example-message/example-message-group";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  model: string;
}

export type AIState = {
  currentModelVariable: string;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

async function continueConversation(
  message: string,
  userLocation?: { latitude: number; longitude: number },
): Promise<ClientMessage> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const summaryUI = createStreamableUI(null);

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "user",
        content: message,
      },
    ],
  });

  const modelVariable = aiState.get().currentModelVariable;

  function getModelFromModelVariable(modelVariable: string) {
    if (!modelVariable) {
      throw new Error("MODEL environment variable is not set");
    } else if (modelVariable.startsWith("gpt-")) {
      return openai(modelVariable);
    } else if (modelVariable.startsWith("mistral-")) {
      return mistral(modelVariable);
    } else if (modelVariable.startsWith("claude-")) {
      return anthropic(modelVariable);
    } else if (modelVariable.includes("gemini-")) {
      return google("models/gemini-pro");
    } else if (modelVariable.includes("llama3-")) {
      return groq(modelVariable);
    } else {
      throw new Error("Model is not a supported model");
    }
  }

  const model: any = getModelFromModelVariable(modelVariable);

  const result = await streamUI({
    model,
    initial: <Spinner />,
    temperature: 0.1,
    system: `
      You are an AI designed to help users with their queries. You can perform tools like searching the web,
      help users find information from the web, get the weather or find out the latest news.
      If you need to get the coordinates of a location, you can use the tool \`get_coordinates\`.
      If someone asks you to get the current weather, you can use the tool \`get_current_weather\`.
      If someone asks you to get the weather forecast or how the weather will look in the future, you can use the tool \`get_weather_forecast\`.
      If someone asks you to get the current weather or the weather forecast and does not provide a unit, you can infer the unit based on the location.
      If someone asks you to search the web, you can use the tool \`search_the_web\`. Unless the user specifies a number of results, you should return 8 results.
      If someone asks you to get the latest news, you can use the tool \`search_the_news\`. 
      If someone asks a question about movies, you can use the tool \`search_for_movies\`.
      If someone asks a question about locations or places to visit, you can use the tool \`search_for_locations\`.
      If someone asks you to find a gif, you can use the tool \`search_for_gifs\`.
      Do not try to use any other tools that are not mentioned here.
      If it is appropriate to use a tool, you can use the tool to get the information. You do not need to explain the tool to the user.
      ${userLocation ? `The user is located at ${userLocation.latitude}, ${userLocation.longitude}` : ""}`,
    messages: aiState.get().messages,
    text: ({ content, done }) => {
      try {
        if (done) {
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              { role: "assistant", content },
            ],
          });
        }
        return <MarkdownContainer children={content} />;
      } catch (error) {
        console.log("error: ", error);
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              role: "assistant",
              content: `Sorry, looks like something went wrong`,
            },
          ],
        });
        return <>Sorry, looks like something went wrong</>;
      }
    },
    tools: {
      get_coordinates: {
        description:
          "Get the coordinates (latitude and longitude) of a location",
        parameters: z.object({
          location: z
            .string()
            .describe(
              "The location to get the current weather for, excluding the country",
            ),
          countryCode: z
            .string()
            .optional()
            .describe(
              "The country code of the location to get the coordinates for. This should be an ISO 3166 country code",
            ),
        }),
        generate: async function* ({ location, countryCode }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the coordinates for {location}...
              <Spinner />
            </>
          );
          try {
            const response = await getCoordinates({ location, countryCode });
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_coordinates",
                      args: { location, countryCode },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_coordinates",
                      result: response,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `The coordinates for ${location} are: ${JSON.stringify(
                    response,
                  )}`,
                },
              ],
            });
            return (
              <>
                The coordinates for {location} are:{" "}
                {JSON.stringify(response, null, 2)}
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_coordinates",
                      args: { location, countryCode },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_coordinates",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error getting the coordinates for ${location}`,
                },
              ],
            });
            return (
              <>
                {`Sorry, there was an error getting the coordinates for ${location}`}
              </>
            );
          }
        },
      },
      get_current_weather: {
        description: "Get the current weather forecast for a location",
        parameters: z.object({
          location: z
            .string()
            .describe(
              "The location to get the current weather for, excluding the country. This can also be inferred from the user's location if available.",
            ),
          countryCode: z
            .string()
            .optional()
            .describe(
              "The country code of the location to get the current weather for. This should be an ISO 3166 country code. This can also be inferred from the user's location if available.",
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'. If no unit is provided by the user, infer the unit based on the location e.g. London would use metric.",
            ),
        }),
        generate: async function* ({ location, countryCode, units }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the current weather for {location}...
              <CurrentWeatherCardSkeleton />
            </>
          );
          try {
            const response = await getCurrentWeather({
              location,
              countryCode,
              units,
            });
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_current_weather",
                      args: { location, countryCode, units },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_current_weather",
                      result: {
                        ...response,
                        location,
                        units,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here's the current weather for ${location}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here's the current weather for {location}:
                <CurrentWeatherCard currentWeather={response} />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_current_weather",
                      args: { location, countryCode, units },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_current_weather",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error getting the current weather for ${location}`,
                },
              ],
            });
            return (
              <>
                {`Sorry, there was an error getting the current weather for ${location}`}
              </>
            );
          }
        },
      },
      get_weather_forecast: {
        description: "Get the weather forecast for a location",
        parameters: z.object({
          location: z
            .string()
            .describe(
              "The location to get the weather forecast for, excluding the country. This can also be inferred from the user's location if available.",
            ),
          forecastDays: z
            .number()
            .min(1)
            .max(7)
            .describe(
              "The number of days to forecast the weather for. Max 7 days",
            ),
          countryCode: z
            .string()
            .optional()
            .describe(
              "The country code of the location to get the weather forecast for. This should be an ISO 3166 country code",
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'",
            ),
        }),
        generate: async function* ({
          location,
          forecastDays,
          countryCode,
          units,
        }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the weather forecast for {location}...
              <WeatherForecastCardSkeleton />
            </>
          );
          try {
            const response = await getWeatherForecast({
              location,
              forecastDays,
              countryCode,
              units,
            });
            console.log("response: ", response);

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_weather_forecast",
                      args: { location, forecastDays, countryCode, units },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_weather_forecast",
                      result: {
                        ...response,
                        location,
                        forecastDays,
                        countryCode,
                        units,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here's the ${forecastDays} day forecast for ${location}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here's the {forecastDays} day forecast for {location}:
                <WeatherForecastCard weatherForecast={response} />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "get_weather_forecast",
                      args: { location, forecastDays, units },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "get_weather_forecast",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error getting the weather forecast for ${location}`,
                },
              ],
            });
            return (
              <>
                Sorry, there was an error getting the weather forecast for{" "}
                {location}
              </>
            );
          }
        },
      },
      search_the_web: {
        description:
          "Search the web for information on a given topic or for a specific query",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query or topic to search for news on"),
          country: z
            .enum([
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
            ])
            .optional()
            .describe(
              "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.",
            ),
          freshness: z
            .enum(["past-day", "past-week", "past-month", "past-year"])
            .optional()
            .describe(
              "The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'.",
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'",
            ),
          count: z
            .number()
            .optional()
            .describe("The number of search results to return"),
          offset: z
            .number()
            .min(1)
            .max(20)
            .optional()
            .describe(
              "The number of pages of search results to skip. The number of results per page is equal to the count parameter.",
            ),
        }),
        generate: async function* ({
          query,
          country,
          freshness,
          units,
          count,
          offset,
        }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching the web for {query}...
              <WebResultCardGroupSkeleton />
            </>
          );
          try {
            const response = await searchTheWeb({
              query,
              country,
              freshness,
              units,
              count,
              offset,
            });

            (async () => {
              const { textStream } = await streamText({
                model: getModelFromModelVariable(modelVariable),
                system: `The user has performed a web search for the following message: <message>${message}</message> and the following query: <query>${query}</query>. Try to use all the relevant web results provided in the search results to respond to the user's message, providing useful and succinct insights.`,
                prompt: `Here are the web search results: ${JSON.stringify(response)}`,
              });

              let summaryText = "";

              for await (const delta of textStream) {
                summaryText += delta;
                summaryUI.update(<MarkdownContainer children={summaryText} />);
              }
              summaryUI.done();
            })();

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_the_web",
                      args: { query, country, freshness, units, count, offset },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_the_web",
                      result: {
                        ...response,
                        query,
                        country,
                        freshness,
                        units,
                        count,
                        offset,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are the search results for ${query}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here are the search results for {query}:
                <WebResultGroup results={response} summary={summaryUI.value} />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_the_web",
                      args: { query, country, freshness, units, count, offset },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_the_web",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching the web for ${query}`,
                },
              ],
            });
            return <>Sorry, there was an error searching the web for {query}</>;
          }
        },
      },
      search_for_images: {
        description: "Search for images on the web for a given topic or query",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query or topic to search for news on"),
          country: z
            .enum([
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
            ])
            .optional()
            .describe(
              "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.",
            ),
          count: z
            .number()
            .min(1)
            .max(100)
            .optional()
            .describe("The number of search results to return"),
        }),
        generate: async function* ({ query, country, count }) {
          const toolCallId = uuidv4();
          yield <>Searching for images of {query}...</>;
          try {
            const response = await searchForImages({
              query,
              country,
              count,
            });

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_images",
                      args: { query, country, count },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_form_images",
                      result: {
                        ...response,
                        query,
                        country,
                        count,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are images of ${query}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here are images of {query}:
                {/* <WebResultGroup results={response} /> */}
                <div className="grid grid-cols-2 gap-4">
                  {response.map((result: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2">
                      <a href={result.url} target="_blank" rel="noreferrer">
                        <img
                          className="rounded-md"
                          src={result.src}
                          alt={result.title}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_images",
                      args: { query, country, count },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_images",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching the web for ${query}`,
                },
              ],
            });
            return <>Sorry, there was an error searching the web for {query}</>;
          }
        },
      },
      search_the_news: {
        description: "Search for news on the web for a given topic",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query or topic to search for news on"),
          country: z
            .enum([
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
            ])
            .optional()
            .describe(
              "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries.",
            ),
          freshness: z
            .enum(["past-day", "past-week", "past-month", "past-year"])
            .optional()
            .describe(
              "The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'.",
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'",
            ),
          count: z
            .number()
            .min(1)
            .max(100)
            .optional()
            .describe("The number of search results to return"),
          offset: z
            .number()
            .min(1)
            .max(100)
            .optional()
            .describe(
              "The number of pages of search results to skip. The number of results per page is equal to the count parameter.",
            ),
        }),
        generate: async function* ({
          query,
          country,
          freshness,
          units,
          count,
          offset,
        }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for news about {query}...
              <WebResultCardGroupSkeleton />
            </>
          );
          try {
            const response = await searchTheNews({
              query,
              country,
              freshness,
              units,
              count,
              offset,
            });

            (async () => {
              const { textStream } = await streamText({
                model: getModelFromModelVariable(modelVariable),
                system: `The user has performed a news search based on the following message: <message>${message}</message> and the following query: <query>${query}</query>. Try to use all the relevant news results provided in the results to respond to the user's message, providing useful and succinct insights.`,
                prompt: `Here are the news search results: ${JSON.stringify(response)}`,
              });

              let summaryText = "";

              for await (const delta of textStream) {
                summaryText += delta;
                summaryUI.update(<MarkdownContainer children={summaryText} />);
              }
              summaryUI.done();
            })();

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_the_news",
                      args: { query, country, freshness, units, count, offset },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_the_news",
                      result: {
                        ...response,
                        query,
                        country,
                        freshness,
                        units,
                        count,
                        offset,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are the latest news articles about ${query}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here are the latest news articles about {query}:
                <WebResultGroup results={response} summary={summaryUI.value} />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_the_news",
                      args: { query, country, freshness, units, count, offset },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_the_news",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching for news about ${query}`,
                },
              ],
            });
            return (
              <>Sorry, there was an error searching for news about {query}</>
            );
          }
        },
      },
      search_for_locations: {
        description: "Search for locations or places to visit",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query or topic to search for locations on."),
          city: z
            .string()
            .describe(
              "The city to search for locations in. The can only be a city and cannot be part of a city. For example, 'London' is valid, but 'North London' is not.",
            ),
          category: z
            .enum(["hotels", "restaurants", "attractions", "geos"])
            .optional()
            .describe(
              "The category of locations to search for. Can be 'hotels', 'restaurants', 'attractions', or 'geos'.",
            ),
          currency: z
            .string()
            .optional()
            .describe(
              "The currency the pricing should be returned in. The currency string is limited to 3 character currency codes following ISO 4217.",
            ),
        }),
        generate: async function* ({ query, city, category, currency }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for locations related to {query} in {city}...
              <LocationCardGroupSkeleton />
            </>
          );
          try {
            const response = await searchForLocations({
              query,
              city,
              category,
              currency,
            });

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      args: { query, city, category, currency },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      result: {
                        ...response,
                        query,
                        city,
                        category,
                        currency,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are the search results for ${query}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here are the search results for {query} in {city}:
                <LocationCardGroup
                  locations={Array.isArray(response) ? response : []}
                />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      args: { query, city, category, currency },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching for locations related to ${query} in ${city}`,
                },
              ],
            });
            return (
              <>
                {`Sorry, there was an error searching for locations related to{" "}${query} in ${city}`}
              </>
            );
          }
        },
      },
      search_for_movies: {
        description: "Get movies from a database based on an input",
        parameters: z.object({
          input: z
            .string()
            .describe("A description of the type of movies to search for"),
          minimumIMDBRating: z
            .number()
            .optional()
            .describe("The minimum IMDB rating of the movies to search for"),
          minimumReleaseYear: z
            .number()
            .optional()
            .describe("The minimum release year of the movies to search for"),
          maximumReleaseYear: z
            .number()
            .optional()
            .describe("The maximum release year of the movies to search for"),
          director: z
            .string()
            .optional()
            .describe("The director of the movies to search for"),
          limit: z
            .number()
            .optional()
            .describe("The number of movies to return"),
        }),
        generate: async function* ({
          input,
          minimumIMDBRating,
          minimumReleaseYear,
          maximumReleaseYear,
          director,
          limit,
        }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for {input} movies...
              <Spinner />
            </>
          );
          try {
            const response = await searchForMovies({
              input,
              minimumIMDBRating,
              minimumReleaseYear,
              maximumReleaseYear,
              director,
              limit,
            });

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_movies",
                      args: {
                        input,
                        minimumIMDBRating,
                        minimumReleaseYear,
                        maximumReleaseYear,
                        director,
                        limit,
                      },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_movies",
                      result: {
                        ...response,
                        input,
                        minimumIMDBRating,
                        minimumReleaseYear,
                        maximumReleaseYear,
                        director,
                        limit,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are movies related to ${input}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <div className="flex flex-col gap-8">
                {Array.isArray(response) ? (
                  response.map((movie: MovieCardProps, index: number) => (
                    <MovieCard
                      title={movie.title}
                      description={movie.description}
                      imdbRating={movie.imdbRating}
                      releaseYear={movie.releaseYear}
                      director={movie.director}
                      genre={movie.genre}
                      stars={movie.stars}
                      imageURL={movie.imageURL}
                      key={index}
                    />
                  ))
                ) : (
                  <div>
                    Sorry, there was an error searching for movies related to{" "}
                    {input}
                  </div>
                )}
              </div>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_movies",
                      args: {
                        input,
                        minimumIMDBRating,
                        minimumReleaseYear,
                        maximumReleaseYear,
                        director,
                        limit,
                      },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_movies",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching for movies related to ${input}`,
                },
              ],
            });
            return (
              <>
                Sorry, there was an error searching for movies related to{" "}
                {input}
              </>
            );
          }
        },
      },
      search_for_gifs: {
        description: "Search for gifs on the web",
        parameters: z.object({
          query: z
            .string()
            .describe("The search query or topic to search for gifs on"),
          limit: z.number().optional().describe("The number of gifs to return"),
          offset: z
            .number()
            .optional()
            .describe(
              "The offset of the gifs to return. Specifies the starting position of the results. Can be used to return the next set of gifs.",
            ),
          rating: z
            .enum(["g", "pg", "pg-13", "r"])
            .optional()
            .describe(
              "The rating of the gifs to return. Can be 'g', 'pg', 'pg-13', or 'r'.",
            ),
        }),
        generate: async function* ({ query, limit, offset, rating }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for gifs related to {query}...
              <Spinner />
            </>
          );
          try {
            const response = await searchForGifs({
              query,
              limit,
              offset,
              rating,
            });

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_gifs",
                      args: { query, limit, offset, rating },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_gifs",
                      result: {
                        ...response,
                        query,
                        limit,
                        offset,
                        rating,
                      },
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Here are the gifs related to ${query}: ${JSON.stringify(response)}`,
                },
              ],
            });
            return (
              <>
                Here are the gifs related to {query}:
                <div className="grid grid-cols-2 gap-4">
                  {response.map((gif: any, index: number) => (
                    <div key={index} className="flex flex-col gap-2">
                      <Image
                        unoptimized
                        className="rounded-md"
                        src={gif.images.original.url}
                        alt={JSON.stringify(gif.title)}
                        width={gif.images.original.width}
                        height={gif.images.original.height}
                      />
                      <h4 className="text-sm text-zinc-500">
                        {JSON.stringify(gif.title)}
                      </h4>
                    </div>
                  ))}
                </div>
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_gifs",
                      args: { query, limit, offset, rating },
                    },
                  ],
                },
                {
                  role: "tool",
                  content: [
                    {
                      type: "tool-result",
                      toolCallId: toolCallId,
                      toolName: "search_for_gifs",
                      result: { error: error },
                      isError: true,
                    },
                  ],
                },
                {
                  role: "assistant",
                  content: `Sorry, there was an error searching for gifs related to ${query}`,
                },
              ],
            });
            return (
              <>
                Sorry, there was an error searching for gifs related to {query}
              </>
            );
          }
        },
      },
    },
  });

  return {
    id: uuidv4(),
    role: "assistant",
    content: result.value,
    model: getAIState().currentModelVariable,
  };
}

async function createExampleMessages(
  modelVariable: string,
  userLocation?: { latitude: number; longitude: number },
) {
  "use server";
  const exampleMessagesUI = createStreamableUI(
    <ExampleMessageCardGroup exampleMessages={[]} />,
  );

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai("gpt-4o"),
      system: `
        You generate fun and engaging examples messages to inspire the user to start a conversation with the LLM assistant.
        The LLM assistant has the following capabilities:
        - Search for news on the web for a given topic
        - Search the web for information on a given topic or for a specific query
        - Display multiple fun or entertaining gifs
        - Get the current weather for a location
        - Get the weather forecast for a location
        - Search for locations or places to visit
        - Get movies from a database based on an input
        - Search for images on the web for a given topic or query
        ${
          userLocation
            ? `The user is located at ${userLocation.latitude}, ${userLocation.longitude}. Try to make the example messages relevant to their location.
        Try to use the name of location in the example messages rather than the coordinates`
            : ""
        }`,
      prompt:
        "Generate 4 example messages to inspire the user to start a conversation with the LLM assistant. Select randomly for the capabilities of the LLM assistant.",
      temperature: 1,
      schema: z.object({
        examples: z.array(
          z.object({
            heading: z
              .string()
              .describe("A short heading for the example message"),
            subheading: z
              .string()
              .describe(
                "A short description of the example message. This is the message that will be sent to the LLM. This should be 12-15 words long.",
              ),
          }),
        ),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      const examples = partialObject.examples;
      // add the model variable to each example
      if (examples !== undefined) {
        const result = examples.map((example, index) => ({
          ...example,
          index,
          modelVariable,
        }));

        // check if examples is array and if it is display the ExampleMessageCardGroup
        if (Array.isArray(result)) {
          exampleMessagesUI.update(
            <ExampleMessageCardGroup exampleMessages={result} />,
          );
        }
      }
    }

    exampleMessagesUI.done();
  })();
  return exampleMessagesUI.value;
}

async function getWeatherForecastUI(
  location: string,
  forecastDays: number,
  countryCode?: string,
  units?: "metric" | "imperial",
) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const toolCallId = uuidv4();

  const uiStream = createStreamableUI(
    <>
      Getting the weather forecast for {location}...
      <WeatherForecastCardSkeleton />
    </>,
  );
  try {
    (async () => {
      const response = await getWeatherForecast({
        location,
        forecastDays,
        countryCode,
        units,
      });
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            role: "user",
            content: `Get the weather forecast for ${location} for ${forecastDays} days`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId: toolCallId,
                toolName: "get_weather_forecast",
                args: { location, forecastDays, countryCode, units },
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolCallId: toolCallId,
                toolName: "get_weather_forecast",
                result: {
                  ...response,
                  location,
                  forecastDays,
                  units,
                },
              },
            ],
          },
          {
            role: "assistant",
            content: `Here's the ${forecastDays} day forecast for ${location}: ${JSON.stringify(response)}`,
          },
        ],
      });
      uiStream.done(
        <>
          Here's the {forecastDays} day forecast for {location}:
          <WeatherForecastCard weatherForecast={response} />
        </>,
      );
    })();
  } catch (error) {
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: toolCallId,
              toolName: "get_weather_forecast",
              args: { location, forecastDays, countryCode, units },
            },
          ],
        },
        {
          role: "assistant",
          content: `Sorry, there was an error getting the weather forecast for ${location}`,
        },
      ],
    });
    uiStream.done(
      <>
        Sorry, there was an error getting the weather forecast for {location}
      </>,
    );
  }
  return {
    id: uuidv4(),
    role: "assistant",
    content: uiStream.value,
    model: getAIState().currentModelVariable,
  };
}

async function getCurrentWeatherUI(
  location: string,
  countryCode?: string,
  units?: "metric" | "imperial",
) {
  "use server";

  if (units === undefined) {
    units = "metric";
  }

  const aiState = getMutableAIState<typeof AI>();
  const toolCallId = uuidv4();

  const uiStream = createStreamableUI(
    <>
      Getting the current weather for {location}...
      <CurrentWeatherCardSkeleton />
    </>,
  );
  try {
    (async () => {
      const response = await getCurrentWeather({
        location,
        countryCode,
        units,
      });
      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            role: "user",
            content: `Get the current weather for ${location}`,
          },
          {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolCallId: toolCallId,
                toolName: "get_current_weather",
                args: { location, countryCode, units },
              },
            ],
          },
          {
            role: "tool",
            content: [
              {
                type: "tool-result",
                toolCallId: toolCallId,
                toolName: "get_current_weather",
                result: {
                  ...response,
                  location,
                  countryCode,
                  units,
                },
              },
            ],
          },
          {
            role: "assistant",
            content: `Here's the current weather for ${location}: ${JSON.stringify(response)}`,
          },
        ],
      });

      uiStream.done(
        <>
          Here's the current weather for {location}:
          <CurrentWeatherCard currentWeather={response} />
        </>,
      );
    })();
  } catch (error) {
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: toolCallId,
              toolName: "get_current_weather",
              args: { location, countryCode, units },
            },
          ],
        },
        {
          role: "assistant",
          content: `Sorry, there was an error getting the current weather for ${location}`,
        },
      ],
    });
  }

  return {
    id: uuidv4(),
    role: "assistant",
    content: uiStream.value,
    model: getAIState().currentModelVariable,
  };
}

export const AI = createAI<AIState, UIState>({
  actions: {
    continueConversation,
    createExampleMessages,
    getWeatherForecastUI,
    getCurrentWeatherUI,
  },
  initialAIState: { currentModelVariable: "gpt-4o", messages: [] } as AIState,
  initialUIState: [] as UIState,
});
