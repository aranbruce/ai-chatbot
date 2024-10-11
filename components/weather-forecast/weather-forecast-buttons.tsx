"use client";

import { useUIState, useAIState, useActions } from "ai/rsc";
import type { AIState, ClientMessage } from "@/app/ai";
import { WeatherForecastProps } from "@/components/weather-forecast/weather-forecast-card";
import { ActionButton } from "../action-button";

export default function WeatherForecastButtons({
  weatherForecast,
}: {
  weatherForecast: WeatherForecastProps;
}) {
  const [, setMessages] = useUIState();
  const [, setAIState] = useAIState();

  const { getCurrentWeatherUI } = useActions();

  const handleGetCurrentWeather = async (
    location: string,
    countryCode: string | undefined,
    units: "metric" | "imperial",
  ) => {
    setAIState((AIState: AIState) => ({
      ...AIState,
      isFinished: false,
    }));
    const response = await getCurrentWeatherUI(location, countryCode, units);
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <ActionButton
        onClick={() =>
          handleGetCurrentWeather(
            weatherForecast.location,
            weatherForecast.countryCode,
            weatherForecast.daily[0].units,
          )
        }
        label={`Current weather in ${weatherForecast.location}`}
      />
    </div>
  );
}
