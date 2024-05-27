import { useState, useEffect } from "react";
import { set } from "zod";

interface Location {
  latitude: number;
  longitude: number;
}

export default function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      setIsLoaded(true);
      return;
    }

    const options = {
      timeout: 5000, // Timeout after 5 seconds
    };

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setIsLoaded(true);
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError(new Error("User denied the request for Geolocation."));
          setIsLoaded(true);
          break;
        case error.POSITION_UNAVAILABLE:
          setError(new Error("Location information is unavailable."));
          setIsLoaded(true);
          break;
        case error.TIMEOUT:
          setError(new Error("The request to get user location timed out."));
          setIsLoaded(true);
          break;
        default:
          setError(new Error("An unknown error occurred."));
          setIsLoaded(true);
          break;
      }
    };

    navigator.geolocation.getCurrentPosition(success, handleError, options);
  }, []);

  return { location, error, isLoaded };
}
