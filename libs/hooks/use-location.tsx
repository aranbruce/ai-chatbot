import { useState, useEffect } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

export default function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError(new Error("User denied the request for Geolocation."));
        break;
      case error.POSITION_UNAVAILABLE:
        setError(new Error("Location information is unavailable."));
        break;
      case error.TIMEOUT:
        setError(new Error("The request to get user location timed out."));
        break;
      default:
        setError(new Error("An unknown error occurred."));
        break;
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error("Geolocation is not supported by your browser"));
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const options = {
      timeout: 5000, // Timeout after 5 seconds
    };

    navigator.geolocation.getCurrentPosition(success, handleError, options);
  }, []);

  return { location, error };
}
