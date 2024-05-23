"use server";

import get_coordinates from "./get-coordinates";

interface Request {
  query: string;
  city: string;
  category?: categoryOptions;
  currency?: string;
}

type categoryOptions = "hotels" | "restaurants" | "attractions" | "geos";

export default async function search_for_locations({
  query,
  city,
  category,
  currency,
}: Request) {
  "use server";
  console.log("Request received for location-search action");

  // check if currency is valid and follows ISO 4217
  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    return { error: "Invalid currency parameter" };
  }

  // Get the longitude and latitude from the city
  const { latitude, longitude } = await get_coordinates({ location: city });

  if (!latitude || !longitude) {
    return { error: "Invalid city" };
  }

  let locations = [];
  const getLocationSummaries = async (
    query: string,
    city: string,
    latitude: number,
    longitude: number,
    category: string | undefined,
  ) => {
    try {
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}&language=en`,
      );
      if (!latitude || !longitude) {
        url.searchParams.append("searchQuery", `${query} in ${city}`);
      } else {
        url.searchParams.append("latLong", `${latitude},${longitude}`);
      }
      if (category) {
        url.searchParams.append("category", category);
      }

      // Make a request to the TripAdvisor API
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data = result.data;
      return data;
    } catch (error) {
      return { error: "Internal server error" };
    }
  };

  const getLocationDetails = async (
    locationId: any,
    currency: string | undefined,
  ) => {
    try {
      // Get details for each location
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?language=en&key=${process.env.TRIPADVISOR_API_KEY}`,
      );
      if (currency) {
        url.searchParams.append("currency", currency);
      }
      const locationResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      const locationResult = await locationResponse.json();
      if (!locationResponse.ok) {
        throw new Error(`HTTP error! status: ${locationResponse.status}`);
      }
      return locationResult;
    } catch (error) {
      // Return an error message if an exception occurred
      return { error: "Internal server error" };
    }
  };

  const getLocationPhotos = async (locationId: string) => {
    try {
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${process.env.TRIPADVISOR_API_KEY}&language=en`,
      );
      const locationPhotosResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });
      if (!locationPhotosResponse.ok) {
        throw new Error(`HTTP error! status: ${locationPhotosResponse.status}`);
      }
      const locationPhotosResult = await locationPhotosResponse.json();
      const data = locationPhotosResult.data;
      let photoURLs = [];
      for (let item of data) {
        let originalImage = item.images.original;
        // Now you can use originalImage
        photoURLs.push(originalImage.url);
      }
      return photoURLs;
    } catch (error) {
      return { error: "Internal server error" };
    }
  };

  locations = await getLocationSummaries(
    query,
    city,
    latitude,
    longitude,
    category ? category : undefined,
  );

  // Get details for each location and add to the locations array
  let locationsWithDetails = [];
  for (const location of locations) {
    const locationDetails = await getLocationDetails(
      location.location_id,
      currency ? currency : undefined,
    );
    locationsWithDetails.push(locationDetails);
  }

  // Get photos for each location and add to the locations array
  let locationsWithDetailsAndPhotos = [];
  for (const location of locationsWithDetails) {
    const locationPhotos = await getLocationPhotos(location.location_id);
    locationsWithDetailsAndPhotos.push({
      ...location,
      photoUrls: locationPhotos,
    });
  }

  locationsWithDetailsAndPhotos = locationsWithDetailsAndPhotos.map(
    (location: any) => {
      return {
        name: location.name,
        rating: location.rating,
        rating_image_url: location.rating_image_url,
        description: location.description,
        priceLevel: location.price_level,
        tripadvisorUrl: location.web_url,
        address: location.address_obj.address_string,
        photoUrls: location.photoUrls,
      };
    },
  );

  return locationsWithDetailsAndPhotos;
}
