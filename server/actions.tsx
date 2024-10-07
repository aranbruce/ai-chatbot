"use server";

import { openai, createOpenAI } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

import {
  CoreMessage,
  LanguageModelV1,
  streamObject,
  streamText,
  tool,
  generateId,
} from "ai";
import { createStreamableUI, getAIState, getMutableAIState } from "ai/rsc";
import { PutBlobResult } from "@vercel/blob";

import { AI } from "@/app/ai";

import getCoordinatesFromLocation from "@/server/get-coordinates-from-location";
import getCurrentWeather from "@/server/get-current-weather";
import getWeatherForecast from "@/server/get-weather-forecast";
import searchTheWeb from "@/server/search-the-web";
import searchForImages from "./search-for-images";
import searchTheNews from "@/server/search-the-news";
import searchForLocations from "@/server/search-for-locations";
import searchForMovies from "@/server/search-for-movies";
import searchForGifs from "@/server/search-for-gifs";
import getWebpageContents from "@/server/get-webpage-content";

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

import {
  exampleMessageSchema,
  getCoordinatesRequestSchema,
  getCurrentWeatherRequestSchema,
  getWeatherForecastRequestSchema,
  getWebpageContentRequestSchema,
  searchForGifsRequestSchema,
  searchForImagesRequestSchema,
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
  content?: React.ReactNode;
  display?: React.ReactNode;
  spinner?: React.ReactNode;
  file?: PutBlobResult;
  model: string;
}

export type AIState = {
  currentModelVariable: string;
  isFinished: boolean;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

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

export async function continueConversation(
  content: string,
  userLocation?: { latitude: number; longitude: number },
  attachment?: any,
): Promise<ClientMessage> {
  "use server";

  const aiState = getMutableAIState();
  const contentStream = createStreamableUI();
  const displayStream = createStreamableUI();
  const spinnerStream = createStreamableUI(<Spinner />);
  const modelVariable = aiState.get().currentModelVariable;
  const model: LanguageModelV1 = getModelFromModelVariable(modelVariable);

  if (attachment) {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: content,
            },
            {
              type: "image",
              image: attachment.url,
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
          content: content,
        },
      ],
    });
  }

  const history = aiState.get().messages.map((message: ClientMessage) => ({
    role: message.role,
    content: message.content,
  }));

  (async () => {
    try {
      const result = await streamText({
        model: model,
        temperature: 0.2,
        system: `
          You are an AI designed to help users with their queries. You can perform tools like searching the web,
          help users find information from the web, get the weather or find out the latest news.
          If asked to describe an image or asked about an image that the user has been provided, assume the user is visually impaired and provide a description of the image.
          If you need to get the coordinates of a location, you can use the tool \`get_coordinates\`.
          If someone asks you to get the current weather, you can use the tool \`get_current_weather\`.
          If someone asks you to get the weather forecast or how the weather will look in the future, you can use the tool \`get_weather_forecast\`.
          If someone asks you to get the current weather or the weather forecast and does not provide a unit, you can infer the unit based on the location.
          If someone asks you to get the content of a webpage, you can use the tool \`get_webpage_content\`.
          If someone asks you to search the web for information on a given topic, you can use the tool \`return_web_results\`. After getting the results, you should call the \`get_webpage_content\` tool.
          If someone asks you to search the web for news on a given topic, you can use the tool \`return_news_web_results\`. After getting the results, you should call the \`get_webpage_content\` tool.
          You should call the \`get_webpage_content\` after getting results from the \`return_web_results\` or \`return_news_web_results\` tools.
          If someone asks a question about movies, you can use the tool \`search_for_movies\`.
          If someone asks a question about locations or places to visit, you can use the tool \`search_for_locations\`.
          If someone asks you to find a gif, you can use the tool \`search_for_gifs\`.
          Do not try to use any other tools that are not mentioned here.
          If it is appropriate to use a tool, you can use the tool to get the information. You do not need to explain the tool to the user.
          ${userLocation ? `The user is located at ${userLocation.latitude}, ${userLocation.longitude}` : ""}`,
        messages: [...history],
        tools: {
          get_coordinates: tool({
            description:
              "Get the coordinates (latitude and longitude) of a location",
            parameters: getCoordinatesRequestSchema,
            execute: async function ({ location, countryCode }) {
              const result = await getCoordinatesFromLocation({
                location,
                countryCode,
              });
              return result;
            },
          }),
          get_current_weather: tool({
            description: "Get the current weather forecast for a location",
            parameters: getCurrentWeatherRequestSchema,
            execute: async function ({ location, countryCode, units }) {
              displayStream.update(<CurrentWeatherCardSkeleton />);

              const result = await getCurrentWeather({
                location,
                countryCode,
                units,
              });
              return result;
            },
          }),
          get_weather_forecast: tool({
            description: "Get the weather forecast for a location",
            parameters: getWeatherForecastRequestSchema,
            execute: async function ({
              location,
              forecastDays,
              countryCode,
              units,
            }) {
              displayStream.update(<WeatherForecastCardSkeleton />);
              const result = await getWeatherForecast({
                location,
                forecastDays,
                countryCode,
                units,
              });
              return result;
            },
          }),
          get_webpage_content: tool({
            description: "Get the content of a webpage",
            parameters: getWebpageContentRequestSchema,
            execute: async function ({ urls }: { urls: string[] }) {
              const result = await getWebpageContents(urls);
              return result;
            },
          }),
          return_web_results: tool({
            description:
              "Returns a list of websites that contain information on a given topic",
            parameters: searchTheWebRequestSchema,
            execute: async function ({
              query,
              country,
              freshness,
              units,
              count,
              offset,
            }) {
              displayStream.update(<WebResultCardGroupSkeleton />);
              contentStream.update(<Spinner />);
              const result = await searchTheWeb({
                query,
                country,
                freshness,
                units,
                count,
                offset,
              });
              return result;
            },
          }),
          return_news_web_results: tool({
            description:
              "Get a list of websites that contain news on a given topic",
            parameters: searchTheNewsRequestSchema,
            execute: async function ({
              query,
              country,
              freshness,
              units,
              count,
              offset,
            }) {
              displayStream.update(<WebResultCardGroupSkeleton />);
              contentStream.update(<Spinner />);
              const result = await searchTheNews({
                query,
                country,
                freshness,
                units,
                count,
                offset,
              });
              return result;
            },
          }),
          search_for_images: tool({
            description:
              "Search for images on the web for a given topic or query",
            parameters: searchForImagesRequestSchema,
            execute: async function ({ query, country, count }) {
              contentStream.update(`Searching for images of ${query}...`);
              const result = await searchForImages({ query, country, count });
              return result;
            },
          }),

          search_for_gifs: tool({
            description:
              "Search for gifs on the web for a given topic or query",
            parameters: searchForGifsRequestSchema,
            execute: async function ({ query, limit, offset, rating }) {
              contentStream.update(`Searching for gifs of ${query}...`);
              const result = await searchForGifs({
                query,
                limit,
                offset,
                rating,
              });
              return result;
            },
          }),
          search_for_locations: tool({
            description: "Search for locations or places to visit",
            parameters: searchForLocationRequestSchema,
            execute: async function ({
              query,
              latitude,
              longitude,
              category,
              currency,
            }) {
              contentStream.update(`Searching for locations of ${query}...`);
              displayStream.update(<LocationCardGroupSkeleton />);
              const result = await searchForLocations({
                query,
                latitude,
                longitude,
                category,
                currency,
              });
              return result;
            },
          }),
          search_for_movies: tool({
            description: "Search for movies based on an input",
            parameters: searchForMoviesRequestSchema,
            execute: async function ({
              input,
              minimumIMDBRating,
              minimumReleaseYear,
              maximumReleaseYear,
              director,
              limit,
            }) {
              contentStream.update(`Searching for movies of ${input}...`);
              displayStream.update(<Spinner />);
              const result = await searchForMovies({
                input,
                minimumIMDBRating,
                minimumReleaseYear,
                maximumReleaseYear,
                director,
                limit,
              });
              return result;
            },
          }),
        },
        maxSteps: 3,

        onStepFinish({ toolCalls, toolResults, usage }) {
          console.log("step finished");
          console.log("Tool Calls: ", toolCalls);
          if (toolCalls.length === 0) {
            return;
          }

          const toolResultsUI = toolResults.map((toolResult) => {
            switch (toolResult.toolName) {
              case "get_current_weather":
                return (
                  <>
                    <CurrentWeatherCard currentWeather={toolResult.result} />
                  </>
                );
              case "get_weather_forecast":
                return (
                  <WeatherForecastCard weatherForecast={toolResult.result} />
                );
              case "return_web_results":
              case "return_news_web_results":
                return <WebResultGroup results={toolResult.result} />;
              case "search_for_images":
                return (
                  <div className="grid grid-cols-2 gap-4">
                    {toolResult.result.map((result: any, index: number) => (
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
                );
              case "search_for_gifs":
                return (
                  <div className="grid grid-cols-2 gap-4">
                    {toolResult.result.map((result: any, index: number) => (
                      <div key={index} className="flex flex-col gap-2">
                        <a href={result.url} target="_blank" rel="noreferrer">
                          <img
                            className="rounded-md"
                            src={result.images.original.url}
                            alt={result.title}
                          />
                          <h4 className="text-sm text-zinc-500">
                            {result.title}
                          </h4>
                        </a>
                      </div>
                    ))}
                  </div>
                );
              case "search_for_locations":
                return Array.isArray(toolResult.result) ? (
                  <LocationCardGroup locations={toolResult.result} />
                ) : (
                  <div>Error: {toolResult.result.error}</div>
                );
              case "search_for_movies":
                return (
                  <div className="flex flex-col gap-8">
                    {Array.isArray(toolResult.result) ? (
                      toolResult.result.map((movie: MovieCardProps, index) => (
                        <MovieCard key={index} {...movie} />
                      ))
                    ) : (
                      <div>Error: {toolResult.result.error}</div>
                    )}
                  </div>
                );
              default:
                return null;
            }
          });

          displayStream.update(
            <div className="flex flex-col gap-8">{toolResultsUI}</div>,
          );

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: generateId(),
                role: "assistant",
                content: toolCalls,
              },
              {
                id: generateId(),
                role: "tool",
                content: toolResults,
              },
            ],
          });
          // console.log("Tool Calls: ", toolCalls);
          // console.log("Tool Results: ", toolResults);
          // console.log("Usage: ", usage);

          // Add error handling
        },
        onFinish({ finishReason, usage, text }) {
          console.log("finish reason", finishReason);
          console.log("usage", usage);
          // console.log("text", text);
        },
      });
      spinnerStream.update(null);
      let textContent = "";

      for await (const part of result.fullStream) {
        switch (part.type) {
          case "text-delta": {
            textContent += part.textDelta;
            contentStream.update(<MarkdownContainer children={textContent} />);
            break;
          }
        }
      }

      aiState.update({
        ...aiState.get(),
        isFinished: true,
        messages: [
          ...aiState.get().messages,
          {
            id: generateId(),
            role: "assistant",
            content: textContent,
          },
        ],
      });
    } catch (error) {
      console.log(error);
      aiState.update({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: generateId(),
            role: "assistant",
            content: "Sorry, there was an error",
          },
        ],
      });
      contentStream.update("Sorry, there was an error");
      displayStream.update(null);
    } finally {
      aiState.done({ ...aiState.get(), isFinished: true });
      contentStream.done();
      displayStream.done();
      spinnerStream.done(null);
    }
  })();

  return {
    id: generateId(),
    role: "assistant",
    content: contentStream.value,
    display: displayStream.value,
    spinner: spinnerStream.value,
    model: modelVariable,
  };
}

export async function createExampleMessages(userLocation?: {
  latitude: number;
  longitude: number;
}) {
  "use server";
  const aiState = getMutableAIState();

  const modelVariable = aiState.get().currentModelVariable;
  const model: LanguageModelV1 = getModelFromModelVariable(modelVariable);

  const exampleMessagesUI = createStreamableUI(
    <ExampleMessageCardGroup exampleMessages={[]} />,
  );

  (async () => {
    try {
      const { elementStream: examples } = await streamObject({
        model: model,
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
        temperature: 0.5,
        schema: exampleMessageSchema,
      });
      const exampleArray: ExampleMessageCardProps[] = [];
      for await (const example of examples) {
        // update example to include model variable
        const generatedExample: ExampleMessageCardProps = {
          ...example,
          index: exampleArray.length,
          modelVariable: modelVariable,
        };
        exampleArray.push(generatedExample);
        exampleMessagesUI.update(
          <ExampleMessageCardGroup exampleMessages={exampleArray} />,
        );
      }
    } catch (error) {
      console.error(error);
      exampleMessagesUI.update("Sorry, there was an error");
    } finally {
      exampleMessagesUI.done();
    }
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

  const aiState = getMutableAIState();
  const contentStream = createStreamableUI(
    `Fetching the weather forecast for ${location}`,
  );
  const displayStream = createStreamableUI(<WeatherForecastCardSkeleton />);
  const spinnerStream = createStreamableUI(<Spinner />);

  const toolCallId = generateId();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "user",
        content: `Fetch the weather forecast at ${location}, ${countryCode}  for ${forecastDays} days, in ${units} units`,
      },
    ],
  });

  (async () => {
    try {
      const response = await getWeatherForecast({
        location,
        forecastDays,
        countryCode,
        units,
      });
      aiState.update({
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
      contentStream.update(
        `Here's the ${forecastDays} day forecast for ${location}`,
      );
      displayStream.update(<WeatherForecastCard weatherForecast={response} />);
    } catch (error) {
      aiState.update({
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
      contentStream.update(
        <>
          Sorry, there was an error getting the weather forecast for {location}
        </>,
      );
      displayStream.update(null);
    } finally {
      aiState.done({ ...aiState.get(), isFinished: true });
      contentStream.done();
      displayStream.done();
      spinnerStream.done(null);
    }
  })();

  return {
    id: generateId(),
    role: "assistant",
    content: contentStream.value,
    display: displayStream.value,
    spinner: spinnerStream.value,
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
  const contentStream = createStreamableUI(
    `Fetching the current weather for ${location}`,
  );
  const displayStream = createStreamableUI(<CurrentWeatherCardSkeleton />);
  const spinnerStream = createStreamableUI(<Spinner />);
  const toolCallId = generateId();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        role: "user",
        content: `Fetch the current weather for ${location}, ${countryCode} in ${units} units`,
      },
    ],
  });

  (async () => {
    try {
      const response = await getCurrentWeather({
        location,
        countryCode,
        units,
      });
      aiState.update({
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
      contentStream.update(`Here's the current weather for ${location}`);
      displayStream.update(<CurrentWeatherCard currentWeather={response} />);
    } catch (error) {
      aiState.update({
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
      contentStream.update(
        <>
          Sorry, there was an error getting the current weather for {location}
        </>,
      );
      displayStream.update(null);
    } finally {
      aiState.done({ ...aiState.get(), isFinished: true });
      contentStream.done();
      displayStream.done();
      spinnerStream.done(null);
    }
  })();

  return {
    id: generateId(),
    role: "assistant",
    content: contentStream.value,
    display: displayStream.value,
    spinner: spinnerStream.value,
    model: getAIState().currentModelVariable,
  };
}
