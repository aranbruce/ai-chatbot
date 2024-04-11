import Image from 'next/image'

export type WeatherTypeProps = {
  weather: "Thunderstorm" | "Drizzle" | "Rain" | "Snow" |  "Mist" | "Smoke" | "Haze" | "Dust" | "Fog" | "Sand" | "Dust" | "Ash" | "Squall" | "Tornado" | "Clear" | "Clouds"
}

type WeatherImageProps = {
  height: number;
  width: number;
  weather: WeatherTypeProps;
}

const WeatherImage: React.FC<WeatherImageProps> = ({ height, width, weather }) => {
  return (
    <Image
      src={`/weather/${weather}.svg`}
      alt={JSON.stringify(weather)}
      width={width}
      height={height}
    />
  )
}

export default WeatherImage