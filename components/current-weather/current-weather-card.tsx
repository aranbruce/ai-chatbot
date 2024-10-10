import { Suspense } from "react";
import WeatherImage, { WeatherTypeProps } from "@/components/weather-image";
import CurrentWeatherButtons from "@/components/current-weather/current-weather-buttons";
import getCurrentWeather from "@/server/get-current-weather";
import { CountryCode, Units } from "@/libs/schema";
import CurrentWeatherCardSkeleton from "@/components/current-weather/current-weather-card-skeleton";

type WeatherProps = {
  temp: number;
  weather: WeatherTypeProps;
};

export type CurrentWeatherCardProps = {
  location: string;
  countryCode: CountryCode | undefined;
  units: Units | undefined;
};

async function WeatherContent({
  location,
  countryCode,
  units,
}: CurrentWeatherCardProps) {
  const currentWeather = await getCurrentWeather({
    location,
    countryCode: countryCode ?? undefined,
    units: units ?? undefined,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col items-center gap-2">
        <h5 className="text-xs font-medium text-zinc-400">
          Weather Forecast: {currentWeather.location}
          {currentWeather.countryCode ? `, ${currentWeather.countryCode}` : ""}
        </h5>
        <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-blue-400 p-3 text-white shadow-md md:p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-1">
            <h5 className="text-xs font-medium">
              {new Date(currentWeather.currentDate).toLocaleDateString(
                undefined,
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </h5>
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-row gap-1">
                <h2 className="text-2xl font-semibold">
                  {currentWeather.current.temp}
                </h2>
                <h5>{currentWeather.units === "metric" ? "°C" : "°F"}</h5>
              </div>
              <WeatherImage
                height={48}
                width={48}
                weather={currentWeather.current.weather}
              />
            </div>
          </div>
          <div className="grid w-full auto-cols-min grid-cols-7 gap-4">
            {currentWeather.hourly
              .slice(0, 7)
              .map((hour: WeatherProps, index: number) => (
                <div
                  className="flex w-8 flex-col items-center gap-1"
                  key={index}
                >
                  <h5 className="text-xs text-zinc-100">
                    {index === 0
                      ? "Now"
                      : ((currentWeather.currentHour + index) % 24)
                          .toString()
                          .padStart(2, "0")}
                  </h5>
                  <WeatherImage height={32} width={32} weather={hour.weather} />
                  <div className="flex flex-row items-center gap-[0.125rem] font-semibold">
                    <h4 className="font-medium">{Math.round(hour.temp)}</h4>
                    <h5 className="text-xs">°</h5>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <CurrentWeatherButtons currentWeather={currentWeather} />
    </div>
  );
}

export default function CurrentWeatherCard(props: CurrentWeatherCardProps) {
  return (
    <Suspense fallback={<CurrentWeatherCardSkeleton />}>
      <WeatherContent {...props} />
    </Suspense>
  );
}
