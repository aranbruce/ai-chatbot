"use server"

import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import Markdown from "react-markdown"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import { v4 as uuidv4 } from 'uuid';

import CurrentWeatherCard from "./components/weather/current-weather-card";
import CurrentWeatherCardSkeleton from "./components/weather/current-weather-card-skeleton";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type Message = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool"
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  role: "user" | "assistant" | "system" | "function" | "data" | "tool"
  display: React.ReactNode
}[]

// An example of a function that fetches weather information from an external API.
async function get_current_weather(location: string, units?: string) {
  try {
    const url = new URL(`${process.env.URL}/api/current-weather`);
    const params = new URLSearchParams({ location });
    if (units) {
      params.append("units", units);
    }
    url.search = params.toString();
    
    const response = await fetch(url, {method: "GET"});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

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
    return error;
  }
}
  

async function submitUserMessage(userInput: string) {
  "use server";
 
  const aiState: any = getMutableAIState<typeof AI>();
  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);
 
  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    initial: <>Working on it...</>,
    messages: [
      { role: "system", content: "You help people understand the weather forecast" },
      ...aiState.get()
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it"s the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content
          }
        ]);
      }
      return (
        <Markdown
          children={content}
          components={{
            // Map `h1` (`# heading`) to use `h2`s.
            h1: "h2",
            h2 (props) {
              const {node, ...rest} = props
              return <h2 className="text-xl font-semibold" {...rest} />
            },
            h3 (props) {
              const {node, ...rest} = props
              return <h3 className="text-lg font-semibold" {...rest} />
            },
            h4 (props) {
              const {node, ...rest} = props
              return <h4 className="text-md font-semibold" {...rest} />
            },
            ol(props) {
              const {node, ...rest} = props
              return <ol className="flex flex-col flex-wrap gap-4" {...rest} />
            },
            ul(props) {
              const {node, ...rest} = props
              return <ul className="flex flex-col flex-wrap gap-4" {...rest} />
            },
            li(props) {
              const {node, ...rest} = props
              return <li className="" {...rest} />
            },
            a(props) {
              const {node, ...rest} = props
              return <a target="_blank" rel="noopener noreferrer" className="text-zinc-950 dark:text-zinc-50 underline focus-visible:rounded-sm focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:ring-offset-zinc-900 focus-visible:ring-2" {...rest} />
            },
            pre(props) {
              const {node, ...rest} = props
              return <pre className="grid w-full" {...rest} />
            },
            code(props) {
              const {children, className, node, ...rest} = props
              const match = /language-(\w+)/.exec(className || "")
              const language = match ? match[1] : "text"
              const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
              return match ? (
                <div className="flex flex-col text-zinc-200 rounded-md overflow-hidden bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
                  <div className="flex justify-between relative bg-zinc-700 text-zinc:600 px-4 py-2 text-xs">
                    <div>{capitalizedLanguage}</div>
                    <button onClick={() => navigator.clipboard.writeText(String(children))}>
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    PreTag="div"
                    language={language} 
                    style={vscDarkPlus}
                    customStyle={{margin: "0", background: "none"}}
                    children={String(children).replace(/\n$/, '')}
                  />
                </div>
              ) : (
                <code {...rest} className="text-sm font-semibold">
                  {children}
                </code>
              )
            },
          }}
        />
      )
    },
    tools: {
      get_current_weather: {
        description: "Get the current weather forecast for a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather forecast for"),
          units: z.enum(["metric", "imperial"]).optional().describe("The units to display the temperature in. Can be 'metric' or 'imperial'"),
        }).required(),
        render: async function* ({ location, units }) {
          // Show a skeleton on the client while we wait for the response.
          yield <CurrentWeatherCardSkeleton />;
                   
          // Fetch the flight information from an external API.
          const response = await get_current_weather(location, units)
          await new Promise((resolve) => setTimeout(resolve, 1500)); 

          const weatherNow = response.current.weather[0].main;
          const tempNow = response.current.temp;
          const tempAndWeatherOverNextHours = response.hourly.map((hour: any) => { return { temp: hour.temp, weather: hour.weather[0].main } });
          const currentHour = new Date().getHours();
          const currentDate = Date.now();
          const currentWeather = {
            location,
            currentHour,
            currentDate,
            weatherNow,
            tempNow,
            units,
            tempAndWeatherOverNextHours
          }
 
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_forecast",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(currentWeather),
            }
          ]);
          // show the weather forecast for the first object in weatherForecast array

          // Return the flight card to the client.
          return <CurrentWeatherCard currentWeather={currentWeather} />;
        }
      },
      search_the_web: {
        description: "Search the web for information on a given topic or for a specific query",
        parameters: z.object({
          query: z.string().describe("The search query or topic to search for news on"),
          country: z.enum(["AR", "AU", "AT", "BE", "BR", "CA", "CL", "DK", "FI", "FR", "DE", "HK", "IN", "ID", "IT", "JP", "KR", "MY", "MX", "NL", "NZ", "NO", "CN", "PL", "PT", "PH", "RU", "SA", "ZA", "ES", "SE", "CH", "TW", "TH", "TR", "GB", "US",]).optional().describe("The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries."),
          freshness: z.enum(["past-day", "past-week", "past-month", "past-year"]).optional().describe("The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'."),
          units: z.enum(["metric", "imperial"]).optional().describe("The units to display the temperature in. Can be 'metric' or 'imperial'"),
        }).required(),
        render: async function* ({ query, country, freshness, units }) {
          // Show a skeleton on the client while we wait for the response.
          yield <>Loading...</>;
                   
          // Fetch the flight information from an external API.
          const response = await search_the_web(query, country, freshness, units)
          // await new Promise((resolve) => setTimeout(resolve, 1500)); 

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_forecast",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(response),
            }
          ]);
          // Get the title, url, description, page_age, thumbnail of each article in the response array and display it in a card
          return (
            <div className="flex flex-col gap-2">
              {response.map((result: any) => (
                <div key={uuidv4()} className="flex flex-row gap-4 w-full">
                  {result.thumbnail && (
                  <img src={result.thumbnail.src} alt="thumbnail" className="h-24 w-24 rounded-xl"/>
                  )}
                  <div className="flex flex-col gap-2 w-full">
                    <h3 className="text-lg font-semibold">{result.title}</h3>
                    <p className="text-sm text-gray-500">{result.description}</p>
                    <a href={result.url} target="_blank" className="text-sm text-blue-500 hover:underline">{result.url}</a>
                    <p className="text-xs text-gray-500">{new Date(result.page_age).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      },
      get_news: {
        description: "Search for news on the web for a given topic",
        parameters: z.object({
          query: z.string().describe("The search query or topic to search for news on"),
          country: z.enum(["AR", "AU", "AT", "BE", "BR", "CA", "CL", "DK", "FI", "FR", "DE", "HK", "IN", "ID", "IT", "JP", "KR", "MY", "MX", "NL", "NZ", "NO", "CN", "PL", "PT", "PH", "RU", "SA", "ZA", "ES", "SE", "CH", "TW", "TH", "TR", "GB", "US",]).optional().describe("The search query country, where the results come from. The country string is limited to 2 character country codes of supported countries."),
          freshness: z.enum(["past-day", "past-week", "past-month", "past-year"]).optional().describe("The freshness of the search results. This filters search results by when they were discovered. Can be 'past-day', 'past-week', 'past-month', or 'past-year'."),
          units: z.enum(["metric", "imperial"]).optional().describe("The units to display the temperature in. Can be 'metric' or 'imperial'"),
        }).required(),
        render: async function* ({ query, country, freshness, units }) {
          // Show a skeleton on the client while we wait for the response.
          yield <>Loading...</>;
                   
          // Fetch the flight information from an external API.
          const response = await get_news(query, country, freshness, units)
          const results = await response.results;
          // await new Promise((resolve) => setTimeout(resolve, 1500)); 

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_forecast",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(results),
            }
          ]);
          // Get the title, url, description, page_age, thumbnail of each article in the results array and display it in a card
          return (
            <div className="flex flex-col gap-2">
              {results.map((result: any) => (
                <div key={uuidv4()} className="flex flex-row gap-4 w-full">
                  {result.thumbnail && (
                  <img src={result.thumbnail.src} alt="thumbnail" className="h-24 w-24 rounded-xl"/>
                  )}
                  <div className="flex flex-col gap-2 w-full">
                    <h3 className="text-lg font-semibold">{result.title}</h3>
                    <p className="text-sm text-gray-500">{result.description}</p>
                    <a href={result.url} target="_blank" className="text-sm text-blue-500 hover:underline">{result.url}</a>
                    <p className="text-xs text-gray-500">{new Date(result.page_age).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      },
    }
  })
 
  return {
    id: Date.now(),
    display: ui,
    role: "assistant"
  };
}
 
// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  id?: string;
  name?: string;
}[] = [];
 
// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
  id: string;
  display: React.ReactNode;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
}[] = [];
 
// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
});