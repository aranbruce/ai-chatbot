import Image from "next/image";

export enum WeatherTypeProps {
  Thunderstorm = "Thunderstorm",
  Drizzle = "Drizzle",
  Rain = "Rain",
  Snow = "Snow",
  Mist = "Mist",
  Smoke = "Smoke",
  Haze = "Haze",
  Dust = "Dust",
  Fog = "Fog",
  Sand = "Sand",
  Ash = "Ash",
  Squall = "Squall",
  Tornado = "Tornado",
  Clear = "Clear",
  Clouds = "Clouds",
}

type WeatherImageProps = {
  height: number;
  width: number;
  weather: WeatherTypeProps;
};

export default function WeatherImage({
  height,
  width,
  weather,
}: WeatherImageProps) {
  return (
    <Image
      src={`/images/weather/${weather.toLowerCase()}.svg`} // Use the lowercase weather value in the image source URL
      alt={JSON.stringify(weather)}
      width={width}
      height={height}
      blurDataURL={`/weather/${weather.toLowerCase()}.svg`}
    />
  );
}
