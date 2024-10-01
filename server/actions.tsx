"use server";

import { openai, createOpenAI } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

import { CoreMessage, streamObject, streamText } from "ai";
import {
  createStreamableUI,
  getAIState,
  getMutableAIState,
  streamUI,
} from "ai/rsc";

import { z } from "zod";
import Image from "next/image";
import { generateId } from "ai";
import { PutBlobResult } from "@vercel/blob";

import getCoordinatesFromLocation from "@/server/get-coordinates-from-location";
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
import { AI } from "@/app/ai";
import {
  exampleMessageSchema,
  getCoordinatesRequestSchema,
  getCurrentWeatherRequestSchema,
  getWeatherForecastRequestSchema,
  searchForGifsRequestSchema,
  searchForLocationRequestSchema,
  searchForMoviesRequestSchema,
  searchTheNewsRequestSchema,
  searchTheWebRequestSchema,
} from "@/libs/schema";
import { ExampleMessageCardProps } from "@/components/example-message/example-message-card";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  file?: PutBlobResult;
  model: string;
}

export type AIState = {
  currentModelVariable: string;
  isFinished: boolean;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

export async function continueConversation(
  message: string,
  userLocation?: { latitude: number; longitude: number },
  imageURL?: string,
): Promise<ClientMessage> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const summaryUI = createStreamableUI(null);

  console.log("imageURL: ", imageURL);

  if (imageURL) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message,
            },
            {
              type: "image",
              image: imageURL,
            },
          ],
        },
      ],
    });
  } else {
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
  }

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
    abortSignal: aiState.get().abortSignal,
    temperature: 0.1,
    system: `
      You are an AI designed to help users with their queries. You can perform tools like searching the web,
      help users find information from the web, get the weather or find out the latest news.
      If asked to describe an image or asked about an image that the user has been provided, assume the user is visually impaired and provide a description of the image.
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
            isFinished: true,
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
          isFinished: true,
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
        parameters: getCoordinatesRequestSchema,
        generate: async function* ({ location, countryCode }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">
                Getting the coordinates for {location}...
              </p>
              <Spinner />
            </>
          );
          try {
            const response = await getCoordinatesFromLocation({
              location,
              countryCode,
            });
            aiState.done({
              ...aiState.get(),
              isFinished: true,
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
              isFinished: true,
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
        parameters: getCurrentWeatherRequestSchema,
        generate: async function* ({ location, countryCode, units }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">
                Getting the current weather for {location}...
              </p>
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
              isFinished: true,
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
              isFinished: true,
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
        parameters: getWeatherForecastRequestSchema,
        generate: async function* ({
          location,
          forecastDays,
          countryCode,
          units,
        }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">
                Getting the weather forecast for {location}...
              </p>
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
            aiState.done({
              ...aiState.get(),
              isFinished: true,
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
              isFinished: true,
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
        parameters: searchTheWebRequestSchema,
        generate: async function* ({
          query,
          country,
          freshness,
          units,
          count,
          offset,
        }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">
                Searching the web for {query}...
              </p>
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
                temperature: 0.1,
                system: `The user has performed a web search for the following message: <message>${message}</message>
                and the following query: <query>${query}</query>. Try to use all the relevant web results provided in
                the search results to respond to the user's message, providing useful and succinct insights.
                Make sure to denote any sources you use the number for that source's result.id with a link with a title of "source" in the following format:
                [result.id](result.url "source")
                Where result.id is the value of the id field in the result,
                result.url is the value of the url field in the result.
                Only the number use the source number for the source link.
                Do not include a title of "source" for normal links, only for sources.
                Source Examples:
                """
                [1](https://example.com "source")
                [2](https://example.com "source")
                [3](https://example.com "source")
                """
                Normal Link Example:
                """
                [Link text](https://example.com)
                """
                Incorrect Example:
                """
                [BBC News](https://bbc.co.uk "source")
                """
                
                `,

                prompt: `Here are the web search results: <results>${JSON.stringify(response)}</results>`,
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
              isFinished: true,
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
              isFinished: true,
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
          const toolCallId = generateId();
          yield <>Searching for images of {query}...</>;
          try {
            const response = await searchForImages({
              query,
              country,
              count,
            });

            aiState.done({
              ...aiState.get(),
              isFinished: true,
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
              isFinished: true,
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
        parameters: searchTheNewsRequestSchema,
        generate: async function* ({
          query,
          country,
          freshness,
          units,
          count,
          offset,
        }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">Searching for news...</p>
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
                temperature: 0.1,
                system: `
                The user has performed a web search for the following message: <message>${message}</message>
                and the following query: <query>${query}</query>. Try to use all the relevant web results provided in
                the search results to respond to the user's message, providing useful and succinct insights.
                Make sure to denote any sources you use the number for that source's result.id with a link with a title of "source" in the following format:
                [result.id](result.url "source")
                Where result.id is the value of the id field in the result,
                result.url is the value of the url field in the result.
                Only the number use the source number for the source link.
                Do not include a title of "source" for normal links, only for sources.
                Source Examples:
                """
                [1](https://example.com "source")
                [2](https://example.com "source")
                [3](https://example.com "source")
                """
                Normal Link Example:
                """
                [Link text](https://example.com)
                """
                Incorrect Example:
                """
                [BBC News](https://bbc.co.uk "source")
                
                """`,
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
              isFinished: true,
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
              isFinished: true,
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
        parameters: searchForLocationRequestSchema,
        generate: async function* ({
          query,
          latitude,
          longitude,
          category,
          currency,
        }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">Searching for locations...</p>
              <LocationCardGroupSkeleton />
            </>
          );
          try {
            const response = await searchForLocations({
              query,
              latitude,
              longitude,
              category,
              currency,
            });

            aiState.done({
              ...aiState.get(),
              isFinished: true,
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      args: { query, latitude, longitude, category, currency },
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
                        latitude,
                        longitude,
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
                Here are the search results for {query}:
                <LocationCardGroup
                  locations={Array.isArray(response) ? response : []}
                />
              </>
            );
          } catch (error) {
            aiState.done({
              ...aiState.get(),
              isFinished: true,
              messages: [
                ...aiState.get().messages,
                {
                  role: "assistant",
                  content: [
                    {
                      type: "tool-call",
                      toolCallId: toolCallId,
                      toolName: "search_for_locations",
                      args: { query, latitude, longitude, category, currency },
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
                  content: `Sorry, there was an error searching for locations related to ${query}`,
                },
              ],
            });
            return (
              <>
                {`Sorry, there was an error searching for locations related to ${query}`}
              </>
            );
          }
        },
      },
      search_for_movies: {
        description: "Get movies from a database based on an input",
        parameters: searchForMoviesRequestSchema,
        generate: async function* ({
          input,
          minimumIMDBRating,
          minimumReleaseYear,
          maximumReleaseYear,
          director,
          limit,
        }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">Searching for movies...</p>
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
              isFinished: true,
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
              isFinished: true,
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
        parameters: searchForGifsRequestSchema,
        generate: async function* ({ query, limit, offset, rating }) {
          const toolCallId = generateId();
          yield (
            <>
              <p className="animate-text_loading">
                Searching for gifs related to {query}...
              </p>
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
              isFinished: true,
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
              isFinished: true,
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
    onFinish: ({ usage }) => {
      const { promptTokens, completionTokens, totalTokens } = usage;
      // your own logic, e.g. for saving the chat history or recording usage
      console.log("Prompt tokens:", promptTokens);
      console.log("Completion tokens:", completionTokens);
      console.log("Total tokens:", totalTokens);
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    content: result.value,
    model: getAIState().currentModelVariable,
  };
}

export async function createExampleMessages(
  modelVariable: string,
  userLocation?: { latitude: number; longitude: number },
) {
  "use server";
  const exampleMessagesUI = createStreamableUI(
    <ExampleMessageCardGroup exampleMessages={[]} />,
  );

  (async () => {
    const { elementStream: examples } = await streamObject({
      model: openai("gpt-4o"),
      output: "array",
      system: `
        You generate fun and engaging examples messages to inspire the user to start a conversation with the LLM assistant.
        The LLM assistant has the following capabilities:
        - 🗞️ Search for news on the web for a given topic
        - 🔎 Search the web for information on a given topic or for a specific query
        - 🌄 Display multiple fun or entertaining gifs
        - 🌤️ Get the current weather for a location
        - ⛅️ Get the weather forecast for a location
        - 🌍 Search for locations or places to visit
        - 🍿 Get movies from a database based on an input
        - 📸 Search for images on the web for a given topic or query
        ${
          userLocation
            ? `The user is located at ${userLocation.latitude}, ${userLocation.longitude}. Try to make the example messages relevant to their location.
        Try to use the name of location in the example messages rather than the coordinates`
            : ""
        }`,
      prompt: `Generate 4 example messages to inspire the user to start a conversation with the LLM assistant using.
        Select randomly for the capabilities of the LLM assistant.
        Include emojis at the start of each example message to make them more engaging.`,
      temperature: 1,
      schema: exampleMessageSchema,
    });
    const exampleArray: ExampleMessageCardProps[] = [];
    for await (const example of examples) {
      // update example to include model variable
      const generatedExample = {
        ...example,
        modelVariable: modelVariable,
        index: exampleArray.length,
      };
      exampleArray.push(generatedExample);
      exampleMessagesUI.update(
        <ExampleMessageCardGroup exampleMessages={exampleArray} />,
      );
    }

    exampleMessagesUI.done();
  })();
  return exampleMessagesUI.value;
}

export async function getWeatherForecastUI(
  location: string,
  forecastDays: number,
  countryCode?: string,
  units?: "metric" | "imperial",
) {
  "use server";

  const aiState = getMutableAIState<typeof AI>();
  const toolCallId = generateId();

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
        isFinished: true,
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
      isFinished: true,
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
    id: generateId(),
    role: "assistant",
    content: uiStream.value,
    model: getAIState().currentModelVariable,
  };
}

export async function getCurrentWeatherUI(
  location: string,
  countryCode?: string,
  units?: "metric" | "imperial",
) {
  "use server";

  if (units === undefined) {
    units = "metric";
  }

  const aiState = getMutableAIState<typeof AI>();
  const toolCallId = generateId();

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
        isFinished: true,
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
      isFinished: true,
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
    id: generateId(),
    role: "assistant",
    content: uiStream.value,
    model: getAIState().currentModelVariable,
  };
}
