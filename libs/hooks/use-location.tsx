import { useState, useEffect } from "react";

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
      clearTimeout(timerId);
    };

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
          console.log("The request to get user location timed out.");
          break;
        default:
          setError(new Error("An unknown error occurred."));
          break;
      }
      setIsLoaded(true);
      clearTimeout(timerId);
    };

    const watchId = navigator.geolocation.getCurrentPosition(
      success,
      handleError,
      options,
    );

    // Set a timeout to handle the case where the user does not make a selection.
    const timerId = setTimeout(() => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (!isLoaded) {
        console.log("No response from user.");
        setError(new Error("No response from user."));
        setIsLoaded(true);
      }
    }, 5000); // Timeout after 5 seconds

    return () => clearTimeout(timerId); // Clear the timeout if the component is unmounted.
  }, []);

  return { location, error, isLoaded };
}
