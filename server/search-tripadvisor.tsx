"use server";

interface Request {
  query: string;
  latitude?: number;
  longitude?: number;
  category?: categoryOptions;
  currency?: string;
}

type categoryOptions = "hotels" | "restaurants" | "attractions" | "geos";

type TripAdvisorLocation = {
  name: string;
  description: string;
  rating?: number;
  price_level?: "$" | "$$" | "$$$" | "$$$$";
  address_obj: {
    address_string: string;
  };
  web_url?: string;
  photoUrls?: string[];
};

type Location = {
  name: string;
  description: string;
  rating?: number;
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  address: string;
  tripadvisorUrl?: string;
  photoUrls?: string[];
};

export default async function searchTripAdvisor({
  query,
  latitude,
  longitude,
  category,
  currency,
}: Request) {
  "use server";
  console.log("Request received for TripAdvisor-search action");

  // check if currency is valid and follows ISO 4217
  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    throw new Error("Invalid currency parameter");
  }

  async function getTripAdvisorLocationIds(
    query: string,
    latitude: number | undefined,
    longitude: number | undefined,
    category: string | undefined,
  ) {
    try {
      const url = new URL(
        `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}&language=en`,
      );
      if (latitude && longitude) {
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
      const locationIds = data.map((location: any) => {
        return {
          location_id: location.location_id,
        };
      });
      return locationIds;
    } catch (error) {
      console.log("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function getTripAdvisorLocationDetails(
    locationId: any,
    currency: string | undefined,
  ) {
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
      console.log("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function getTripAdvisorLocationPhotos(locationId: string) {
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
      let photoUrls = [];
      for (let item of data) {
        let originalImage = item.images.original;
        photoUrls.push(originalImage.url);
      }
      return photoUrls;
    } catch (error) {
      // this line causes issues
      return { error: "Internal server error" };
    }
  }

  async function getTripAdvisorLocationDetailsAndPhotos(locationId: string) {
    try {
      // Fetch both details and photos in parallel
      const [locationDetails, locationPhotos] = await Promise.all([
        getTripAdvisorLocationDetails(locationId, currency),
        getTripAdvisorLocationPhotos(locationId),
      ]);
      return {
        ...locationDetails,
        photoUrls: locationPhotos,
      };
    } catch (error) {
      console.log("Error: ", error);
      throw new Error("Internal server error");
    }
  }

  async function getTripAdvisorLocations() {
    // get the location Ids
    const locationIds = await getTripAdvisorLocationIds(
      query,
      latitude,
      longitude,
      category,
    );

    // Create a promise for each location to fetch its details and photos in parallel
    const locationPromises = locationIds.map((locationId: any) =>
      getTripAdvisorLocationDetailsAndPhotos(locationId.location_id),
    );

    // Wait for all promises to resolve
    const locations = await Promise.all(locationPromises);

    return locations;
  }

  let tripAdvisorLocations = await getTripAdvisorLocations();

  tripAdvisorLocations = tripAdvisorLocations.map(
    (location: TripAdvisorLocation) => {
      return {
        name: location.name,
        rating: location.rating,
        description: location.description,
        priceLevel: location.price_level,
        tripadvisorUrl: location.web_url,
        address: location.address_obj.address_string,
        photoUrls: location.photoUrls,
      };
    },
  ) as Location[];

  return tripAdvisorLocations;
}
