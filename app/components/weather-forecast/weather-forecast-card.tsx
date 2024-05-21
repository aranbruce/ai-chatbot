"use client";

import WeatherImage, { WeatherTypeProps } from "../weather-image";
import { useActions, useUIState } from "ai/rsc";

export interface WeatherForecastProps {
  location: string;
  daily: WeatherForecastDayProps[];
}

interface WeatherForecastDayProps {
  dayIndex: number;
  temperatureMain: number;
  temperatureMin: number;
  temperatureMax: number;
  weather: WeatherTypeProps;
  units: "metric" | "imperial";
}

const WeatherForecastCard = ({
  weatherForecast,
}: {
  weatherForecast: WeatherForecastProps;
}) => {
  const [, setMessages] = useUIState();
  const { submitRequestToGetCurrentWeather } = useActions();

  // take the day and return the day of the week based on today"s date. If the day is 0, it will return today"s day of the week
  const getDayOfWeek = (day: number) => {
    if (day === 0) {
      return "Today";
    }
    const today = new Date().getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[(today + day) % 7];
  };

  const handleGetCurrentWeather = async (
    location: string,
    units: "metric" | "imperial",
  ) => {
    console.log("Getting current weather");
    const newMessage = await submitRequestToGetCurrentWeather(location, units);
    setMessages((currentMessages: any[]) => [...currentMessages, newMessage]);
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="w-full text-center text-xs font-medium text-zinc-400">
          {weatherForecast.daily.length} Day Weather Forecast
        </h5>
        <div className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-blue-400 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-xl font-medium text-white">
            {weatherForecast.daily.length} Days Weather Forecast
          </h4>
          {weatherForecast.daily.map((day: any, index: number) => (
            <div
              key={index}
              className="gap:2 grid w-full grid-cols-[88px_32px_56px_60px] items-center justify-between sm:gap-4"
            >
              <p className="text-white">{getDayOfWeek(index)}</p>
              <WeatherImage height={32} width={32} weather={day.weather} />
              <h5 className="text-xl font-medium text-white">
                {Math.round(day.temperatureMain)}{" "}
                {day.units === "metric" ? "°C" : "°F"}
              </h5>
              <div className="flex flex-row items-center gap-4 text-center">
                <div className="flex flex-col gap-1 text-white">
                  <p className="text-xs">Min</p>
                  <p className="font-medium">
                    {Math.round(day.temperatureMin)}°
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-white">
                  <p className="text-xs">Max</p>
                  <p className="font-medium">
                    {Math.round(day.temperatureMax)}°
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <button
          className="flex w-fit flex-row items-center gap-2 rounded-xl border border-zinc-200/50 bg-zinc-100 px-2 py-1 text-sm text-zinc-600"
          onClick={() =>
            handleGetCurrentWeather(
              weatherForecast.location,
              weatherForecast.daily[0].units,
            )
          }
        >
          <svg
            strokeLinejoin="round"
            viewBox="0 0 16 16"
            width="14"
            fill="currentcolor"
          >
            <path
              d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
              fill="currentColor"
            ></path>
            <path
              d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
              fill="currentColor"
            ></path>
          </svg>
          Current weather in {weatherForecast.location}
        </button>
      </div>
    </>
  );
};

export default WeatherForecastCard;
