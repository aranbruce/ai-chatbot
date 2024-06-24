"use server";

import { generateObject } from "ai";
import getWebpageContents from "./get-webpage-content";
import searchTheWeb from "./search-the-web";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import getLocationFromCoordinates from "./get-location-from-coordinates";
import searchTripAdvisor from "./search-tripadvisor";

interface Request {
  query: string;
  latitude?: number;
  longitude?: number;
  category?: categoryOptions;
  currency?: string;
}

type categoryOptions = "hotels" | "restaurants" | "attractions" | "geos";

// type Location = {
//   name: string;
//   description: string;
//   rating?: number;
//   priceLevel?: "$" | "$$" | "$$$" | "$$$$";
//   address: string;
//   tripAdvisorLink?: string;
//   photos?: string[];
// };

export default async function searchForLocations({
  query,
  latitude,
  longitude,
  category,
  currency,
}: Request) {
  "use server";
  console.log("Request received for location-search action");

  // check if currency is valid and follows ISO 4217
  if (currency && !/^[A-Z]{3}$/.test(currency)) {
    console.log("error: Invalid currency parameter");
    return { error: "Invalid currency parameter" };
  }
  async function getLocationsFromWebSearch(query: string) {
    if (latitude && longitude) {
      // get locations from coordinates
      const response = await getLocationFromCoordinates({
        latitude: latitude,
        longitude: longitude,
      });
      const location = response.location;
      query = `${query} in ${location}`;
    }
    console.log("Query: ", query);

    const webPages = await searchTheWeb({
      query: query,
    });

    const webPageContents = webPages.map(async (webPage: any) => {
      return await getWebpageContents(webPage.url);
    });
    const webSearchLocations = await Promise.all(webPageContents);
    return webSearchLocations;
  }

  // async function formatLocations(data: any) {
  //   // console.log("Data: ", data);
  //   try {
  //     const { object: response } = await generateObject({
  //       model: openai("gpt-4o"),
  //       system: `You are a helpful assistant that processes data containing details of different
  //     locations for a single destination. Your task is to read the data and extract information
  //     about the locations for that destination. You should return the extracted locations as an
  //     array of locations containing a "name", "description" "priceLevel" and "address". You should
  //     only extract the locations from the data and for the destination in the data.
  //     You should not include any locations that are not in the data provided.
  //     You should not return any locations that are not in the destination.`,
  //       prompt: `Here is the data to extract the locations from: <data>${JSON.stringify(data)}</data>`,
  //       schema: z.object({
  //         locations: z.array(
  //           z.object({
  //             name: z.string().describe("The name of the location."),
  //             description: z
  //               .string()
  //               .describe("The description of the location."),
  //             priceLevel: z
  //               .enum([
  //                 "$",
  //                 "$$",
  //                 "$$$",
  //                 "$$$$",
  //                 "$-$$",
  //                 "$$-$$",
  //                 "$$-$$$",
  //                 "$$$-$$$$",
  //               ])
  //               .describe(
  //                 "The price level of the location. $: Low, $$: Medium, $$$: High, $$$$: Very High.",
  //               )
  //               .optional(),
  //             address: z
  //               .string()
  //               .describe("The address of the location.")
  //               .optional(),
  //             tripAdvisorLink: z
  //               .string()
  //               .describe("The TripAdvisor link.")
  //               .optional(),
  //             photos: z
  //               .array(z.string())
  //               .describe("The photos of the location.")
  //               .optional(),
  //           }),
  //         ),
  //       }),
  //     });
  //     // console.log("Response: ", response.locations);

  //     return response.locations;
  //   } catch (error) {
  //     console.log("Error: ", error);
  //     return { error: "Internal server error" };
  //   }
  // }

  const tripAdvisorLocations = await searchTripAdvisor({
    query,
    latitude,
    longitude,
    category,
    currency,
  });

  // const webSearchLocations = await getLocationsFromWebSearch(query);

  // const allLocations = [...tripAdvisorLocations, ...webSearchLocations];

  // const response = await formatLocations(webSearchLocations);

  return tripAdvisorLocations;
}
