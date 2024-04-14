import WeatherImage, { WeatherTypeProps } from "../weather-image"


interface WeatherForecastCardProps {
  day: number,
  temperature: number,
  minTemperature: number,
  maxTemperature: number,
  weather: WeatherTypeProps
  units: "metric" | "imperial"
}

const WeatherForecastCard = ({day, temperature, minTemperature, maxTemperature, weather, units} : WeatherForecastCardProps ) => {

  // take the day and return the day of the week based on today"s date. If the day is 0, it will return today"s day of the week
  const getDayOfWeek = (day: number) => {
    if (day === 0) {
      return "Today";
    }
    const today = new Date().getDay();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[(today + day) % 7];
  }
  
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <p className="text-sm text-white">{getDayOfWeek(day)}</p>
      <WeatherImage height={32} width={32} weather={weather}/>
      <div className="flex flex-row gap-2">
        <p className="text-sm text-white">Min: {minTemperature} {units === "metric" ? "°C" : "°F"}</p>
        <p className="text-sm text-white">Temp: {temperature} {units === "metric" ? "°C" : "°F"}</p>
        <p className="text-sm text-white">Max: {maxTemperature} {units === "metric" ? "°C" : "°F"}</p>
      </div>
    </div>
  );
}

export default WeatherForecastCard;