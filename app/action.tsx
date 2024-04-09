import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";

import CurrentWeatherCard from "./components/current-weather-card";
 
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
  return ( 
    <div className="flex flex-col items-center gap-2 w-full min-w-80">
      <div className="animate-spin rounded-full h-[18px] w-[18px] border-t-2 border-zinc-950 dark:border-zinc-100"></div>
    </div>
  )
}

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
    initial: <Spinner/>,
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
      return content;
    },
    tools: {
      get_current_weather: {
        description: "Get the current weather forecast for a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather forecast for"),
          units: z.string().optional().describe("The units to display the temperature in. Can be 'metric' or 'imperial'"),
        }).required(),
        render: async function* ({ location, units }) {
          // Show a spinner on the client while we wait for the response.
          yield <Spinner/>

          // Fetch the flight information from an external API.
          const response = await get_current_weather(location, units)

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
      }
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