import "server-only"

import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import Markdown from "react-markdown"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from "next/image";

import CurrentWeatherCard from "./components/current-weather/current-weather-card";
import CurrentWeatherCardSkeleton from "./components/current-weather/current-weather-card-skeleton";
import Spinner from "./components/spinner";
import NewsCardGroup from "./components/news-card/news-card-group";
import NewsCardGroupSkeleton from "./components/news-card/news-card-group-skeleton";
import WebResultGroup from "./components/web-results/web-result-group";
import WebResultCardGroupSkeleton from "./components/web-results/web-result-group-skeleton";
import WeatherForecastCard from "./components/weather-forecast/weather-forecast-card";
 
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
  "use server"
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

async function get_weather_forecast(location: string, units?: string, forecast_days?: number) {
  "use server"
  try {
    const url = new URL(`${process.env.URL}/api/weather-forecast`);
    const params = new URLSearchParams({ location });
    if (units) {
      params.append("units", units);
    }
    if (forecast_days) {
      params.append("forecast_days", forecast_days.toString());
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
  "use server"
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
  "use server"
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

async function search_for_locations(query: string, category?: string, currency?: string) {
  "use server"
  try {
    let url = `${process.env.URL}/api/location-search?query=${query}`
    if (category) {
      url += `&category=${category}`
    }
    if (currency) {
      url += `&currency=${currency}`
    }
    const response = await fetch(url, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return error;
  }
}

async function search_for_movies(input: string, minimumIMDBRating?: number, minimumReleaseYear?: number, maximumReleaseYear?: number, director?: string, limit?: number) {
  "use server"
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

async function submitUserMessage(userInput: string) {
  "use server"
 
  const aiState: any = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
    },
  ]);
  
  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    initial: <Spinner/>,
    messages: [
      { role: "system", 
      content: `
        You are an AI designed to help users with their queries. You can perform functions like searching the web.
        You can help users find information from the web, get the weather or find out the latest news.
        If someone asks you to search the web, you can use the function \`search_the_web\`.
        If someone asks you to get the latest news, you can use the function \`get_news\`.
        If someone asks you to get the current weather, you can use the function \`get_current_weather\`.
        If someone asks you to get the weather forecast or how the weather will look in the future, you can use the function \`get_weather_forecast\`.
        Make sure to confirm their location and the units they want the temperature in.
        If someone asks you to search for gifs, you can use the function \`search_for_gifs\`. Try to us a variety of related search terms.
        If someone asks a question about movies, you can use the function \`search_for_movies\`.
        If someone asks a question about locations or places to visit, you can use the function \`search_for_locations\`.
        For gifs, try to display the image as markdown and provide a link to the source with a title for the gif.
        For locations, try to provide a link to the location, a brief description of the location and a rating.
        When asked to analyze a file make sure to look at the most recent file provided when appropriate.
        If the user doesn't ask about the file, you can ignore it.
      `
      },
      ...aiState.get()
    ],
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
                   
          // Fetch the current weather information from an external API.
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
      },
      get_weather_forecast: {
        description: "Get the weather forecast for a location",
        parameters: z.object({
          location: z.string().describe("The location to get the weather forecast for"),
          units: z.enum(["metric", "imperial"]).optional().describe("The units to display the temperature in. Can be 'metric' or 'imperial'"),
          forecast_days: z.number().describe("The number of days to forecast the weather for"),
        }).required(),
        render: async function* ({ location, units, forecast_days }) {
          // Show a skeleton on the client while we wait for the response.
          yield <div>Loading...</div>;
                   
          // Fetch the current weather information from an external API.
          const response = await get_weather_forecast(location, units, forecast_days)
          const forecast = response.daily

          console.log(forecast)

          const weatherForecast: { title: string, url: string, description: string, date: string, author:string }[] = forecast.map((day: any, index: number) => {
            return {
              day: day.index,
              temperature: day.temp.day,
              minTemperature: day.temp.min,
              maxTemperature: day.temp.max,
              weather: day.weather[0].main,
              units: units,
            }
          });

          console.log(weatherForecast)
            
            
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_weather_forecast",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(weatherForecast),
            }
          ]);
          // Return the flight card to the client.
          return (
            <div className="flex flex-col gap-4 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-blue-400 dark:bg-zinc-900">
              <h4 className="text-xl text-white font-semibold">{weatherForecast.length} Days Weather Forecast</h4>
              {weatherForecast.map((day: any, index) => (
                <WeatherForecastCard
                  day={index}
                  temperature={day.temperature}
                  minTemperature={day.minTemperature}
                  maxTemperature={day.maxTemperature}
                  weather={day.weather}
                  units={day.units}
                />
              ))}
            </div>
            );
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
          yield <WebResultCardGroupSkeleton/>;
                   
          // Fetch the search web information from an external API.
          const response = await search_the_web(query, country, freshness, units)
          // await new Promise((resolve) => setTimeout(resolve, 1500)); 

          const results: { title: string, url: string, description: string, date: string, author:string }[] = response.map((result: any) => {
            return {
              title: result.title,
              url: result.url,
              description: result.description,
              date: result.page_age,
              author: result.profile.name,
            }
          });

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "search_the_web",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(results),
            }
          ]);
          // Get the title, url, description, page_age, thumbnail of each article in the response array and display it in a card
          return (
            <WebResultGroup results={results} />
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
          yield <NewsCardGroupSkeleton />;
                   
          // Fetch the news information from an external API.
          const response = await get_news(query, country, freshness, units)
          const results = response.results
          // allowed results: title, url, description, page_age as age, image as thumbnail.src
          const news: { title: string, url: string, description: string, date: string, image: string }[] = results.map((result: any) => {
            return {
              title: result.title,
              url: result.url,
              description: result.description,
              date: result.page_age,
              image: result.thumbnail.src
            }
          });
          
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_news",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(results),
            }
          ]);
          // Get the title, url, description, page_age, thumbnail of each article in the results array and display it in a card
          return (
            <NewsCardGroup news={news} />
          )
        }
      },
      search_for_locations: {
        description: "Search for locations or places to visit",
        parameters: z.object({
          query: z.string().describe("The search query or topic to search for locations on"),
          category: z.enum(["hotels", "restaurants", "attractions", "geos"]).optional().describe("The category of locations to search for. Can be 'hotels', 'restaurants', 'attractions', or 'geos'."),
          currency: z.string().optional().describe("he currency to be used for the location details. The currency string is limited to 3 character currency codes following ISO 4217."),
        }).required(),
        render: async function* ({ query, category, currency }) {
          // Show a skeleton on the client while we wait for the response.
           yield <Spinner/>;
                   
          // Fetch the news information from an external API.
          const response = await search_for_locations(query, category, currency)
          const results = response
          
          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "search_for_locations",
              // Content can be any string to provide context to the LLM in the rest of the conversation.
              content: JSON.stringify(results),
            }
          ]);
          return (
            <div className="flex flex-col gap-8">
              {results.map((result: any, index: number) => (
                <div className="flex flex-col gap-2 p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg" key={index}>
                  <div className="flex flex-row gap-4 justify-between">
                    <h3 className="text-zinc-950 dark:text-white font-semibold">{result.name}</h3>
                    <Image src={result.rating_image_url} width={119} height={20} alt={result.rating} />
                  </div>

                  <p className="text-sm text-zinc-700 dark:text-zinc-400">{result.description}</p>
                  <p>Price: {result.price_level}</p>
                  <a className="text-sm font-semibold" href={result.web_url} target="_blank" rel="noopener noreferrer">See more</a>
                </div>
              ))}
            </div>
          )
        }
      },
      search_for_movies: {
        description: "Get movies from a database based on an input",
        parameters: z.object({
          input: z.string().describe("A description of the type of movies to search for"),
          minimumIMDBRating: z.number().optional().describe("The minimum IMDB rating of the movies to search for"),
          minimumReleaseYear: z.number().optional().describe("The minimum release year of the movies to search for"),
          maximumReleaseYear: z.number().optional().describe("The maximum release year of the movies to search for"),
          director: z.string().optional().describe("The director of the movies to search for"),
          limit: z.number().optional().describe("The number of movies to return"),
        }).required(),
        render: async function* ({ input, minimumIMDBRating, minimumReleaseYear, maximumReleaseYear, director, limit }) {
          // Show a skeleton on the client while we wait for the response.
          yield <Spinner/>;

          // Fetch the news information from an external API.
          const response = await search_for_movies(input, minimumIMDBRating, minimumReleaseYear, maximumReleaseYear, director, limit)
          const matches = response.matches
          console.log(matches)
          const movies = matches.map((match: any) => {
            return {
              title: match.metadata.title,
              imdbRating: match.metadata.imdbRating,
              genre: match.metadata.genre,
              releaseYear: match.metadata.releaseYear,
              director: match.metadata.director,
              imageURL: match.metadata.imageURL,
              description: match.metadata.description,
              stars: [match.metadata.star1, match.metadata.star2, match.metadata.star3, match.metadata.star4]
            }
          })
          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "search_for_movies",
              content: JSON.stringify(movies),
            }
          ]);
          return (
            // display each movie in the movies array as a card
            <div className="flex flex-col gap-8">
              {movies.map((movie: any, index: number) => (
                <div className="flex flex-col items-start	 sm:flex-row gap-8 p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg" key={index}>
                  {movie.imageURL && (<Image className="rounded-md" src={movie.imageURL} width={80} height={117} alt={movie.title} />)}
                  <div className="flex flex-col gap-4 justify-between">
                    <h3 className="text-zinc-950 dark:text-white font-semibold">{movie.title}</h3>
                    <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-400">
                      <p>{movie.description}</p>
                      <p>IMDB Rating: {movie.imdbRating}</p>
                      <p>Release Year: {movie.releaseYear}</p>
                      <p>Director: {movie.director}</p>
                      <p>Genre: {movie.genre}</p>
                      <div className="flex flex-row gap-2">
                        {/* add each movie star with a , between */}
                        {movie.stars.map((star: string, index: number) => (
                          <span key={index}>{star}{index < movie.stars.length - 1 && ", "}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
            </div>
          )
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

async function submitFile(filesAsInput: any, fileCollection: any, userInput?: string) {
  "use server"
  // console.log("File data received:", filesAsInput);

  const fileData = filesAsInput.map((file: any) => {
    const fileContent = fileCollection.find((fileObject: any) => fileObject.fileId === file.fileId)?.fileContent;
    return {
      fileId: file.fileId,
      fileName: file.fileName,
      fileContent,
    };
  });

  // console.log("File data:", fileData);

  const aiState: any = getMutableAIState<typeof AI>();
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      // content: userInput,
      content: "Tell me about this file."
    },
    {
      role: "system",
      content: `
      Analyze the following data 
      provided as a document as part of your answer to the users question: 
      <fileData>${JSON.stringify(fileData)}</fileData>
      `,
    }
  ]);

  const ui = render({
    model: "gpt-4-0125-preview",
    provider: openai,
    initial: <Spinner/>,
    messages: [
      { role: "system", 
      content: `
        You are an AI designed to help users with their queries. You can perform functions like searching the web.
        You can help users find information from the web, get the weather or find out the latest news.
        If someone asks you to search the web, you can use the function \`search_the_web\`.
        If someone asks you to get the latest news, you can use the function \`get_news\`.
        If someone asks you to get the current weather, you can use the function \`get_current_weather\`.
        If someone asks you to get the weather forecast or how the weather will look in the future, you can use the function \`get_weather_forecast\`.
        Make sure to confirm their location and the units they want the temperature in.
        If someone asks you to search for gifs, you can use the function \`search_for_gifs\`. Try to us a variety of related search terms.
        If someone asks a question about movies, you can use the function \`search_for_movies\`.
        If someone asks a question about locations or places to visit, you can use the function \`search_for_locations\`.
        For gifs, try to display the image as markdown and provide a link to the source with a title for the gif.
        For locations, try to provide a link to the location, a brief description of the location and a rating.
        When asked to analyze a file make sure to look at the most recent file provided when appropriate.
        If the user doesn't ask about the file, you can ignore it.
      `
      },
      ...aiState.get()
    ],
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
    submitUserMessage,
    submitFile
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState
});