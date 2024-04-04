import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("GET request received for location-search route");
    // Get the query parameter from the request
    const query = request.nextUrl.searchParams.get("query")
    const category = request.nextUrl.searchParams.get("category")
    const currency = request.nextUrl.searchParams.get("currency")

    if (!query) {
        return NextResponse.json({ error: "A search query is required" }, { status: 400 })
    }

    if (category && !["hotels", "restaurants", "attractions", "geos"].includes(category)) {
        return NextResponse.json({ error: "Invalid category parameter" }, { status: 400 })
    }

    // check if currency is valid and follows ISO 4217
    if (currency && !/^[A-Z]{3}$/.test(currency)) {
        return NextResponse.json({ error: "Invalid currency parameter" }, { status: 400 })
    }

    try {
        let url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&searchQuery=${query}&language=en`;
        if (category) {
            url += `&category=${category}`
        }

        // Make a request to the TripAdvisor API
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;

        // Make a new request for each location in the data
        let locations = [];
        for (const location of data) {
            let locationDetailsUrl = `https://api.content.tripadvisor.com/api/v1/location/${location.location_id}/details?key=${process.env.TRIPADVISOR_API_KEY}&language=en`;
            if (currency) {
                locationDetailsUrl += `&currency=${currency}`
            }
            const locationResponse = await fetch(locationDetailsUrl);
            const locationResult = await locationResponse.json();
            // Add the location details to the locations array
            locations.push(locationResult);
        }
        // Return the data from the TripAdvisor API
        return NextResponse.json(locations, { status: 200 });

    } catch (error) {
        // Return an error message if an exception occurred
        NextResponse.json({ error: "Internal server error" }), { status: 500 };
    }
}