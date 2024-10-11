"use client";

import { useUIState, useAIState, useActions } from "ai/rsc";
import type { AIState, ClientMessage } from "@/app/ai";
import { CurrentWeatherCardProps } from "./current-weather-card";
import { ActionButton } from "../action-button";

export default function CurrentWeatherButtons({
  currentWeather,
}: {
  currentWeather: CurrentWeatherCardProps;
}) {
  const [, setMessages] = useUIState();
  const [, setAIState] = useAIState();
  const { getWeatherForecastUI, getCurrentWeatherUI } = useActions();

  const handleGetWeatherForecast = async (
    location: string,
    forecastDays: number,
    countryCode?: string,
    units?: "metric" | "imperial",
  ) => {
    setAIState((prevState: AIState) => ({
      ...prevState,
      isFinished: false,
    }));
    const response = await getWeatherForecastUI(
      location,
      forecastDays,
      countryCode,
      units,
    );
    setMessages((prevMessages: ClientMessage[]) => [...prevMessages, response]);
  };

  const handleGetCurrentWeather = async (
    location: string,
    countryCode?: string,
    units?: "metric" | "imperial",
  ) => {
    setAIState((prevState: AIState) => ({
      ...prevState,
      isFinished: false,
    }));
    const response = await getCurrentWeatherUI(location, countryCode, units);
    setMessages((prevMessages: ClientMessage[]) => [...prevMessages, response]);
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <ActionButton
        onClick={() =>
          handleGetWeatherForecast(
            currentWeather.location,
            3,
            currentWeather.countryCode ?? undefined,
            currentWeather.units ?? undefined,
          )
        }
        label="3 day forecast"
      />
      <ActionButton
        onClick={() =>
          handleGetWeatherForecast(
            currentWeather.location,
            5,
            currentWeather.countryCode ?? undefined,
            currentWeather.units ?? undefined,
          )
        }
        label="5 day forecast"
      />
      <ActionButton
        onClick={() =>
          handleGetCurrentWeather(
            currentWeather.location === "New York" ? "London" : "New York",
            currentWeather.countryCode === "US" ? "GB" : "US",
            currentWeather.units ?? undefined,
          )
        }
        label={`Weather in ${
          currentWeather.location === "New York" ? "London" : "New York"
        }`}
      />
    </div>
  );
}
