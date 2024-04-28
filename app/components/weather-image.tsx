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

const WeatherImage: React.FC<WeatherImageProps> = ({
  height,
  width,
  weather,
}) => {
  return (
    <Image
      src={`/weather/${weather.toLowerCase()}.svg`} // Use the lowercase weather value in the image source URL
      alt={JSON.stringify(weather)}
      width={width}
      height={height}
    />
  );
};

export default WeatherImage;
