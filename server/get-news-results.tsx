import { CountryCode, FreshnessOptions } from "@/libs/schema";

interface Request {
  query: string;
  country?: CountryCode;
  freshness?: FreshnessOptions;
  units?: "metric" | "imperial";
  count?: number;
  offset?: number;
}

export default async function getNewsResults({
  query,
  country,
  freshness,
  units,
  count = 8,
  offset,
}: Request) {
  "use server";
  console.log("Request received for get_news_results action");

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
      `https://api.search.brave.com/res/v1/news/search?q=${query}&count=${count}`,
    );

    if (country) {
      url.searchParams.append("country", country);
    }
    if (freshness) {
      url.searchParams.append("freshness", freshnessParam);
    }
    if (units) {
      url.searchParams.append("units", units);
    }
    if (offset) {
      url.searchParams.append("offset", offset.toString());
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
    const data = await response.json();

    let results = data.results;

    results = results.map((result: any, index: number) => ({
      id: index + 1,
      title: result.title,
      url: result.url,
      description: result.description,
      date: result.page_age,
      imageURL: result.meta_url?.favicon,
      author: result.meta_url?.netloc,
      extra: result.extra_snippets,
    }));

    return results;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
