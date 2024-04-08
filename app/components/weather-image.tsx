import Image from 'next/image'

export type WeatherTypeProps = {
  weather: "clear sky" | "few clouds" | "scattered clouds" | "overcast clouds" | "broken clouds" | "shower rain" | "light rain" | "rain" | "heavy intensity rain" | "thunderstorm" | "snow" | "mist"
}

type WeatherImageProps = {
  height: number;
  width: number;
  weather: WeatherTypeProps;
}

const WeatherImage: React.FC<WeatherImageProps> = ({ height, width, weather }) => {
  const weatherWithHyphens = String(weather).replace(/\s/g, '-');
  return (
    <Image
      src={`/weather/${weatherWithHyphens}.svg`}
      alt={JSON.stringify(weather)}
      width={width}
      height={height}
    />
  )
}

export default WeatherImage