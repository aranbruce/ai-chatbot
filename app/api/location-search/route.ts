import { NextRequest, NextResponse } from "next/server";
import { string } from "zod";

export async function GET(request: NextRequest) {
    console.log("GET request received for location-search route");
    // Get the query parameter from the request
    const query = request.nextUrl.searchParams.get("query")
    const city= request.nextUrl.searchParams.get("city")
    const category = request.nextUrl.searchParams.get("category")
    const currency = request.nextUrl.searchParams.get("currency")

    console.log("Query: ", query);
    console.log("City: ", city);

    if (!query) {
        return NextResponse.json({ error: "A search query is required" }, { status: 400 })
    }

    if (!city) {
        return NextResponse.json({ error: "A city location is required" }, { status: 400 })
    }

    if (category && !["hotels", "restaurants", "attractions", "geos"].includes(category)) {
        return NextResponse.json({ error: "Invalid category parameter" }, { status: 400 })
    }

    // check if currency is valid and follows ISO 4217
    if (currency && !/^[A-Z]{3}$/.test(currency)) {
        return NextResponse.json({ error: "Invalid currency parameter" }, { status: 400 })
    }

    // Get the longitude and latitude from the city
    const getCoordinates = async (query: string) => {
        try {
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
        const headers = {
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        };
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const latitude: number = data[0].lat;
        const longitude: number = data[0].lon;
        return { 
            latitude: latitude,
            longitude: longitude 
        };

        } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({error: `Error occurred: ${error}`}, { status: 500 });
        }
    }

    const coordinates = await getCoordinates(city);
    const { latitude, longitude } = coordinates as { latitude: number; longitude: number; };

    let locations = [];
    const getLocationSummaries = async (query: string, city: string, latitude: number, longitude: number, category: string | undefined ) => {
        try {
        let url = ""
        if (!latitude || !longitude) {
            url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}%20in%20${city}&language=en`;
        } else {
            url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}&latLong=${latitude},${longitude}&language=en`;
        }
        if (category) {
            url += `&category=${category}`
        }

        // Make a request to the TripAdvisor API
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;
        return data;
        } catch (error) {
            return NextResponse.json({ error: "Internal server error" }), { status: 500 };
        }
    }

    const getLocationDetails = async (locationId: any, currency: string | undefined) => {
        try {
            // Get details for each location
            let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${process.env.TRIPADVISOR_API_KEY}&language=en`;
            if (currency) {
                locationDetailsUrl += `&currency=${currency}`
            }
            const locationResponse = await fetch(locationDetailsUrl);
            const locationResult = await locationResponse.json();
            return locationResult;
        } catch (error) {
            // Return an error message if an exception occurred
            return NextResponse.json({ error: "Internal server error" }), { status: 500 };
        }
    }

    const getLocationPhotos = async (locationId: string) => {
        try {
            let locationPhotosUrl = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/photos?key=${process.env.TRIPADVISOR_API_KEY}&language=en`;
            const locationPhotosResponse = await fetch(locationPhotosUrl);
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
            return NextResponse.json({ error: "Internal server error" }), { status: 500 };
        }
    }

    locations = await getLocationSummaries(query, city, latitude, longitude, category? category : undefined);

    // Get details for each location and add to the locations array
    let locationsWithDetails = [];
    for (const location of locations) {
        const locationDetails = await getLocationDetails(location.location_id, currency? currency : undefined);
        locationsWithDetails.push(locationDetails);
    }

    // Get photos for each location and add to the locations array
    let locationsWithDetailsAndPhotos = [];
    for (const location of locationsWithDetails) {
        const locationPhotos = await getLocationPhotos(location.location_id);
        locationsWithDetailsAndPhotos.push({
            ...location,
            photoUrls: locationPhotos
        });
    }
    return NextResponse.json(locationsWithDetailsAndPhotos, { status: 200 });
}