import { Suspense } from "react";
import WeatherImage, { WeatherTypeProps } from "@/components/weather-image";
import WeatherForecastButtons from "@/components/weather-forecast/weather-forecast-buttons";
import WeatherForecastCardSkeleton from "@/components/weather-forecast/weather-forecast-card-skeleton";
import getWeatherForecast from "@/server/get-weather-forecast";
import { CountryCode, Units } from "@/libs/schema";

export interface WeatherForecastProps {
  location: string;
  forecastDays: number;
  countryCode?: CountryCode | undefined;
  daily: WeatherForecastDayProps[];
}

interface WeatherForecastDayProps {
  dayIndex: number;
  temperatureMain: number;
  temperatureMin: number;
  temperatureMax: number;
  weather: WeatherTypeProps;
  units: Units;
}

export interface WeatherForecastCardProps {
  location: string;
  forecastDays: number;
  countryCode: CountryCode | undefined;
  units: Units | undefined;
}

function getDayOfWeek(day: number) {
  if (day === 0) {
    return "Today";
  }
  const today = new Date().getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[(today + day) % 7];
}

async function WeatherForecastContent({
  location,
  forecastDays,
  countryCode,
  units,
}: WeatherForecastCardProps) {
  const weatherForecast = await getWeatherForecast({
    location,
    forecastDays,
    countryCode: countryCode ?? undefined,
    units: units ?? undefined,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="w-full text-center text-xs font-medium text-zinc-400">
          {weatherForecast.forecastDays} Day Weather Forecast for{" "}
          {weatherForecast.location}
          {weatherForecast.countryCode
            ? `, ${weatherForecast.countryCode}`
            : ""}
        </h5>
        <div className="flex w-full flex-col gap-4 rounded-lg border border-zinc-200 bg-blue-400 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-xl font-medium text-white">
            {weatherForecast.daily.length} Days Weather Forecast
          </h4>
          <div className="flex flex-col justify-between gap-2 sm:flex-row">
            {weatherForecast.daily.map(
              (day: WeatherForecastDayProps, index: number) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between gap-2 sm:flex-col"
                >
                  <p className="min-w-10 text-center text-sm text-white">
                    {getDayOfWeek(index)}
                  </p>
                  <WeatherImage height={32} width={32} weather={day.weather} />
                  <h5 className="text-lg font-medium text-white">
                    {Math.round(day.temperatureMain)}{" "}
                    {day.units === "metric" ? "°C" : "°F"}
                  </h5>
                  <div className="flex flex-row items-center gap-4 text-center">
                    <div className="flex flex-col gap-1 text-white">
                      <p className="text-xs font-medium">
                        {`${Math.round(day.temperatureMin)}° - ${Math.round(day.temperatureMax)}°`}
                      </p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <WeatherForecastButtons weatherForecast={weatherForecast} />
    </div>
  );
}

export default function WeatherForecastCard(props: WeatherForecastCardProps) {
  return (
    <Suspense fallback={<WeatherForecastCardSkeleton />}>
      <WeatherForecastContent {...props} />
    </Suspense>
  );
}
