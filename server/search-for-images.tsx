import { SearchForImagesRequest } from "@/libs/schema";

export type ImageResult = {
  imageTitle: string;
  imageSrc: string;
  websiteUrl: string;
  websiteName: string;
};

export default async function searchForImages({
  query,
  country,
  count = 5,
}: SearchForImagesRequest) {
  "use server";
  console.log("Request received for search_for_images action");

  try {
    const url = new URL(
      `https://api.search.brave.com/res/v1/images/search?q=${query}&count=${count}`,
    );

    if (country) {
      url.searchParams.append("country", country);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseJson = await response.json();
    let results = responseJson.results;

    results = results.map((result: any) => ({
      imageTitle: result.title,
      imageSrc: result.thumbnail.src,
      websiteUrl: result.url,
      websiteName: result.source,
    })) as ImageResult[];

    return results as ImageResult[];
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
