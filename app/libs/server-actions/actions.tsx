"use server";

import { openai, createOpenAI } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

import { v4 as uuidv4 } from "uuid";

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  streamUI,
} from "ai/rsc";

import { z } from "zod";
import Markdown from "react-markdown";

import get_coordinates from "./get-coordinates";
import get_current_weather from "./get-current-weather";
import get_weather_forecast from "./get-weather-forecast";
import search_the_web from "./search-the-web";
import search_the_news from "./search-the-news";
import search_for_locations from "./search-for-locations";
import search_for_movies from "./search-for-movies";
import search_for_gifs from "./search-for-gifs";

import CurrentWeatherCard from "../../components/current-weather/current-weather-card";
import CurrentWeatherCardSkeleton from "../../components/current-weather/current-weather-card-skeleton";
import Spinner from "../../components/spinner";
import CodeContainer from "../../components/code-container";
import NewsCardGroup from "../../components/news-card/news-card-group";
import NewsCardGroupSkeleton from "../../components/news-card/news-card-group-skeleton";
import WebResultGroup from "../../components/web-results/web-result-group";
import WebResultCardGroupSkeleton from "../../components/web-results/web-result-group-skeleton";
import WeatherForecastCard from "../../components/weather-forecast/weather-forecast-card";
import WeatherForecastCardSkeleton from "../../components/weather-forecast/weather-forecast-card-skeleton";
import MovieCard, {
  MovieCardProps,
} from "../../components/movie-card/movie-card";
import LocationCardGroup from "../../components/location-card/location-card-group";
import LocationCardGroupSkeleton from "../../components/location-card/location-card-group-skeleton";
import Image from "next/image";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const modelVariable = process.env.MODEL || "";
let model: any = null;
if (!modelVariable) {
  throw new Error("MODEL environment variable is not set");
} else if (modelVariable.startsWith("gpt-")) {
  model = openai(modelVariable);
} else if (modelVariable.startsWith("mistral-")) {
  model = mistral(modelVariable);
} else if (modelVariable.startsWith("claude-")) {
  model = anthropic(modelVariable);
} else if (modelVariable.includes("gemini-")) {
  model = google("models/gemini-pro");
} else if (modelVariable.includes("llama3-")) {
  const model = groq(modelVariable);
} else {
  throw new Error("MODEL environment variable is not a supported model");
}

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
}

async function continueConversation(userInput: string): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();
  history.update((messages: ServerMessage[]) => [
    ...history.get(),
    { role: "user", content: userInput },
  ]);

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
      If someone asks you to search the web, you can use the tool \`search_the_web\`.
      If someone asks you to get the latest news, you can use the tool \`search_the_news\`.
      If someone asks a question about movies, you can use the tool \`search_for_movies\`.
      If someone asks a question about locations or places to visit, you can use the tool \`search_for_locations\`.
      If someone asks you to find a gif, you can use the tool \`search_for_gifs\`.
      Do not try to use any other tools that are not mentioned here.
      If it is appropriate to use a tool, you can use the tool to get the information. You do not need to explain the tool to the user.
      `,
    messages: [...history.get()],
    text: ({ content, done }) => {
      try {
        if (done) {
          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: "assistant", content },
          ]);
        }
        return (
          <Markdown
            children={content}
            components={{
              // Map `h1` (`# heading`) to use `h2`s.
              h1: "h2",
              h2(props) {
                const { node, ...rest } = props;
                return <h2 className="text-xl font-semibold" {...rest} />;
              },
              h3(props) {
                const { node, ...rest } = props;
                return <h3 className="text-lg font-semibold" {...rest} />;
              },
              h4(props) {
                const { node, ...rest } = props;
                return <h4 className="text-md font-semibold" {...rest} />;
              },
              ol(props) {
                const { node, ...rest } = props;
                return (
                  <ol className="flex flex-col flex-wrap gap-4" {...rest} />
                );
              },
              ul(props) {
                const { node, ...rest } = props;
                return (
                  <ul className="flex flex-col flex-wrap gap-4" {...rest} />
                );
              },
              li(props) {
                const { node, ...rest } = props;
                return <li className="" {...rest} />;
              },
              a(props) {
                const { node, ...rest } = props;
                return (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-950 dark:text-zinc-50 underline focus-visible:rounded-sm focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:ring-offset-zinc-900 focus-visible:ring-2"
                    {...rest}
                  />
                );
              },
              pre(props) {
                const { node, ...rest } = props;
                return <pre className="grid w-full" {...rest} />;
              },
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "text";
                const capitalizedLanguage =
                  language.charAt(0).toUpperCase() +
                  language.slice(1).toLowerCase();
                return match ? (
                  <CodeContainer
                    capitalizedLanguage={capitalizedLanguage}
                    language={language}
                    children={children}
                  />
                ) : (
                  <code {...rest} className="text-sm font-semibold">
                    {children}
                  </code>
                );
              },
            }}
          />
        );
      } catch (error) {
        console.log("error: ", error);
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
            .describe("The location to get the coordinates for"),
        }),
        generate: async function* ({ location }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the coordinates for {location}...
              <Spinner />
            </>
          );
          try {
            const response = await get_coordinates({ location });
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_coordinates",
                    args: { location },
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
                  response
                )}`,
              },
            ]);
            return (
              <>
                The coordinates for {location} are:{" "}
                {JSON.stringify(response, null, 2)}
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_coordinates",
                    args: { location },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error getting the coordinates for ${location}`,
              },
            ]);
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
            .describe("The location to get the current weather for"),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'. If no unit is provided by the user, infer the unit based on the location e.g. London would use metric."
            ),
        }),
        generate: async function* ({ location, units }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the current weather for {location}...
              <CurrentWeatherCardSkeleton />
            </>
          );
          try {
            const response = await get_current_weather({
              location,
              units,
            });
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_current_weather",
                    args: { location, units },
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
            ]);
            return (
              <>
                Here's the current weather for {location}:
                <CurrentWeatherCard currentWeather={response} />
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_current_weather",
                    args: { location, units },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error getting the current weather for ${location}`,
              },
            ]);
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
            .describe("The location to get the weather forecast for"),
          forecast_days: z
            .number()
            .describe("The number of days to forecast the weather for"),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'"
            ),
        }),
        generate: async function* ({ location, forecast_days, units }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Getting the weather forecast for {location}...
              <WeatherForecastCardSkeleton />
            </>
          );
          try {
            const response = await get_weather_forecast({
              location,
              forecast_days,
              units,
            });
            console.log("response: ", response);

            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_weather_forecast",
                    args: { location, forecast_days, units },
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
                      forecast_days,
                      units,
                    },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Here's the ${forecast_days} day forecast for ${location}: ${JSON.stringify(response)}`,
              },
            ]);

            return (
              <>
                Here's the {forecast_days} day forecast for {location}:
                <WeatherForecastCard weatherForecast={response} />
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "get_weather_forecast",
                    args: { location, forecast_days, units },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error getting the weather forecast for ${location}`,
              },
            ]);
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
              "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries."
            ),
          freshness: z
            .enum(["past-day", "past-week", "past-month", "past-year"])
            .optional()
            .describe(
              "The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'."
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'"
            ),
          count: z
            .number()
            .optional()
            .describe("The number of search results to return"),
        }),
        generate: async function* ({
          query,
          country,
          freshness,
          units,
          count,
        }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching the web for {query}...
              <WebResultCardGroupSkeleton />
            </>
          );
          try {
            const response = await search_the_web({
              query,
              country,
              freshness,
              units,
              count,
            });

            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_the_web",
                    args: { query, country, freshness, units },
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
                    },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Here are the search results for ${query}: ${JSON.stringify(response)}`,
              },
            ]);
            return (
              <>
                Here are the search results for {query}:
                <WebResultGroup results={response} />
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_the_web",
                    args: { query, country, freshness, units },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error searching the web for ${query}`,
              },
            ]);
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
              "The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries."
            ),
          freshness: z
            .enum(["past-day", "past-week", "past-month", "past-year"])
            .optional()
            .describe(
              "The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'."
            ),
          units: z
            .enum(["metric", "imperial"])
            .optional()
            .describe(
              "The units to display the temperature in. Can be 'metric' or 'imperial'. For celsius, use 'metric' and for fahrenheit, use 'imperial'"
            ),
        }),
        generate: async function* ({ query, country, freshness, units }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for news about {query}...
              <NewsCardGroupSkeleton />
            </>
          );
          try {
            const response = await search_the_news({
              query,
              country,
              freshness,
              units,
              count: 10,
            });
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_the_news",
                    args: { query, country, freshness, units },
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
                    },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Here are the latest news articles about ${query}: ${JSON.stringify(response)}`,
              },
            ]);
            return (
              <>
                Here are the latest news articles about {query}:
                <NewsCardGroup news={response} />
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_the_news",
                    args: { query, country, freshness, units },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error searching for news about ${query}`,
              },
            ]);
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
              "The city to search for locations in. The can only be a city and cannot be part of a city. For example, 'London' is valid, but 'North London' is not."
            ),
          category: z
            .enum(["hotels", "restaurants", "attractions", "geos"])
            .optional()
            .describe(
              "The category of locations to search for. Can be 'hotels', 'restaurants', 'attractions', or 'geos'."
            ),
          currency: z
            .string()
            .optional()
            .describe(
              "The currency the pricing should be returned in. The currency string is limited to 3 character currency codes following ISO 4217."
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
            const response = await search_for_locations({
              query,
              city,
              category,
              currency,
            });

            history.done([
              ...history.get(),
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
            ]);
            return (
              <>
                Here are the search results for {query} in {city}:
                <LocationCardGroup
                  locations={Array.isArray(response) ? response : []}
                />
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
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
                role: "assistant",
                content: `Sorry, there was an error searching for locations related to ${query} in ${city}`,
              },
            ]);
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
            const response = await search_for_movies({
              input,
              minimumIMDBRating,
              minimumReleaseYear,
              maximumReleaseYear,
              director,
              limit,
            });

            history.done([
              ...history.get(),
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
            ]);
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
            history.done([
              ...history.get(),
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
                role: "assistant",
                content: `Sorry, there was an error searching for movies related to ${input}`,
              },
            ]);
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
          rating: z
            .enum(["g", "pg", "pg-13", "r"])
            .optional()
            .describe(
              "The rating of the gifs to return. Can be 'g', 'pg', 'pg-13', or 'r'."
            ),
        }),
        generate: async function* ({ query, limit, rating }) {
          const toolCallId = uuidv4();
          yield (
            <>
              Searching for gifs related to {query}...
              <Spinner />
            </>
          );
          try {
            const response = await search_for_gifs({
              query,
              limit,
              rating,
            });

            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_for_gifs",
                    args: { query, limit, rating },
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
                      rating,
                    },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Here are the gifs related to ${query}: ${JSON.stringify(response)}`,
              },
            ]);
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
                      <h4 className="text-zinc-500 text-sm">
                        {JSON.stringify(gif.title)}
                      </h4>
                    </div>
                  ))}
                </div>
              </>
            );
          } catch (error) {
            history.done([
              ...history.get(),
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId: toolCallId,
                    toolName: "search_for_gifs",
                    args: { query, limit, rating },
                  },
                ],
              },
              {
                role: "assistant",
                content: `Sorry, there was an error searching for gifs related to ${query}`,
              },
            ]);
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
    display: result.value,
    role: "assistant",
  };
}

async function submitFile(
  filesAsInput: any,
  fileCollection: any,
  userInput?: string
) {
  "use server";

  const fileData = filesAsInput.map((file: any) => {
    const fileContent = fileCollection.find(
      (fileObject: any) => fileObject.fileId === file.fileId
    )?.fileContent;
    return {
      fileId: file.fileId,
      fileName: file.fileName,
      fileContent,
    };
  });

  const history = getMutableAIState();
  history.update((messages: ServerMessage[]) => [
    ...history.get(),
    {
      role: "user",
      content: userInput ? userInput : "User requested to analyze the file",
    },
  ]);

  const result = await streamUI({
    model,
    initial: <Spinner />,
    system: `
    Analyze the following data
    provided as a document as part of your answer to the users question:
    <fileData>${JSON.stringify(fileData)}</fileData>
    `,
    messages: [...history.get()],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }
      return (
        <Markdown
          children={content}
          components={{
            // Map `h1` (`# heading`) to use `h2`s.
            h1: "h2",
            h2(props) {
              const { node, ...rest } = props;
              return <h2 className="text-xl font-semibold" {...rest} />;
            },
            h3(props) {
              const { node, ...rest } = props;
              return <h3 className="text-lg font-semibold" {...rest} />;
            },
            h4(props) {
              const { node, ...rest } = props;
              return <h4 className="text-md font-semibold" {...rest} />;
            },
            ol(props) {
              const { node, ...rest } = props;
              return <ol className="flex flex-col flex-wrap gap-4" {...rest} />;
            },
            ul(props) {
              const { node, ...rest } = props;
              return <ul className="flex flex-col flex-wrap gap-4" {...rest} />;
            },
            li(props) {
              const { node, ...rest } = props;
              return <li className="" {...rest} />;
            },
            a(props) {
              const { node, ...rest } = props;
              return (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-950 dark:text-zinc-50 underline focus-visible:rounded-sm focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:ring-offset-zinc-900 focus-visible:ring-2"
                  {...rest}
                />
              );
            },
            pre(props) {
              const { node, ...rest } = props;
              return <pre className="grid w-full" {...rest} />;
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "text";
              const capitalizedLanguage =
                language.charAt(0).toUpperCase() +
                language.slice(1).toLowerCase();
              return match ? (
                <CodeContainer
                  capitalizedLanguage={capitalizedLanguage}
                  language={language}
                  children={children}
                />
              ) : (
                <code {...rest} className="text-sm font-semibold">
                  {children}
                </code>
              );
            },
          }}
        />
      );
    },
  });

  return {
    id: uuidv4(),
    display: result.value,
    role: "assistant",
  };
}

async function submitRequestToGetWeatherForecast(
  location: string,
  forecast_days: number,
  units?: "metric" | "imperial" | undefined
) {
  "use server";

  const history = getMutableAIState();
  const toolCallId = uuidv4();

  const uiStream = createStreamableUI(
    <>
      Getting the weather forecast for {location}...
      <WeatherForecastCardSkeleton />
    </>
  );
  try {
    (async () => {
      const response = await get_weather_forecast({
        location,
        forecast_days,
        units,
      });

      history.done([
        ...history.get(),
        {
          role: "user",
          content: `Get the weather forecast for ${location} for ${forecast_days} days`,
        },
        {
          role: "assistant",
          content: [
            {
              type: "tool-call",
              toolCallId: toolCallId,
              toolName: "get_weather_forecast",
              args: { location, forecast_days, units },
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
                forecast_days,
                units,
              },
            },
          ],
        },
        {
          role: "assistant",
          content: `Here's the ${forecast_days} day forecast for ${location}: ${JSON.stringify(response)}`,
        },
      ]);
      uiStream.done(
        <>
          Here's the {forecast_days} day forecast for {location}:
          <WeatherForecastCard weatherForecast={response} />
        </>
      );
    })();
  } catch (error) {
    history.done([
      ...history.get(),
      {
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId: toolCallId,
            toolName: "get_weather_forecast",
            args: { location, forecast_days, units },
          },
        ],
      },
      {
        role: "assistant",
        content: `Sorry, there was an error getting the weather forecast for ${location}`,
      },
    ]);
    uiStream.done(
      <>Sorry, there was an error getting the weather forecast for {location}</>
    );
  }
  return {
    id: uuidv4(),
    display: uiStream.value,
    role: "assistant",
  };
}

async function submitRequestToGetCurrentWeather(
  location: string,
  units: "metric" | "imperial" | undefined
) {
  "use server";

  if (units === undefined) {
    units = "metric";
  }

  const history = getMutableAIState();
  const toolCallId = uuidv4();

  const uiStream = createStreamableUI(
    <>
      Getting the current weather for {location}...
      <CurrentWeatherCardSkeleton />
    </>
  );
  try {
    (async () => {
      const response = await get_current_weather({ location, units });
      history.done([
        ...history.get(),
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
              args: { location, units },
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
      ]);

      uiStream.done(
        <>
          Here's the current weather for {location}:
          <CurrentWeatherCard currentWeather={response} />
        </>
      );
    })();
  } catch (error) {
    history.done([
      ...history.get(),
      {
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId: toolCallId,
            toolName: "get_current_weather",
            args: { location, units },
          },
        ],
      },
      {
        role: "assistant",
        content: `Sorry, there was an error getting the current weather for ${location}`,
      },
    ]);
  }

  return {
    id: uuidv4(),
    display: uiStream.value,
    role: "assistant",
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
    submitFile,
    submitRequestToGetWeatherForecast,
    submitRequestToGetCurrentWeather,
  },
  initialAIState: [],
  initialUIState: [],
});
