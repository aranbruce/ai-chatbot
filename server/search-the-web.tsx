import { CountryCode, FreshnessOptions } from "@/libs/schema";

interface Request {
  query: string;
  country?: CountryCode;
  freshness?: FreshnessOptions;
  units?: "metric" | "imperial";
  count?: number;
  offset?: number;
}

export default async function searchTheWeb({
  query,
  country,
  freshness,
  units,
  count = 8,
  offset,
}: Request) {
  "use server";
  console.log("Request received for search_the_web action");

  let freshnessParam = "";

  if (freshness) {
    if (freshness === "past-day") {
      freshnessParam = "pd";
    } else if (freshness === "past-week") {
      freshnessParam = "pw";
    } else if (freshness === "past-month") {
      freshnessParam = "pm";
    } else if (freshness === "past-year") {
      freshnessParam = "py";
    }
  }
  try {
    const url = new URL(
      `https://api.search.brave.com/res/v1/web/search?q=${query}&text_decorations=0&count=${count}`,
    );
    // add optional parameters
    if (country) {
      url.searchParams.append("country", country);
    }
    if (freshness) {
      url.searchParams.append("freshness", freshness);
    }
    if (units) {
      url.searchParams.append("units", units);
    }
    if (offset) {
      url.searchParams.append("offset", offset.toString());
    }

    const headers = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY || "",
    };

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let results = data.web.results;

    results = results.map((result: any, index: number) => ({
      id: index + 1,
      title: result.title,
      url: result.url,
      description: result.description,
      date: result.page_age,
      author: result.profile?.name,
      imageURL: result.profile.img,
      extra: result.extra_snippets,
    }));

    return results;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
