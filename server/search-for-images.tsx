interface Request {
  query: string;
  country?: countryOptions;
  count?: number;
}

type countryOptions =
  | "AR"
  | "AU"
  | "AT"
  | "BE"
  | "BR"
  | "CA"
  | "CL"
  | "DK"
  | "FI"
  | "FR"
  | "DE"
  | "HK"
  | "IN"
  | "ID"
  | "IT"
  | "JP"
  | "KR"
  | "MY"
  | "MX"
  | "NL"
  | "NZ"
  | "NO"
  | "CN"
  | "PL"
  | "PT"
  | "PH"
  | "RU"
  | "SA"
  | "ZA"
  | "ES"
  | "SE"
  | "CH"
  | "TW"
  | "TH"
  | "TR"
  | "GB"
  | "US";

export default async function search_for_images({
  query,
  country,
  count = 5,
}: Request) {
  "use server";
  console.log("Request received for search_for_images action");

  try {
    const url = new URL(
      `https://api.search.brave.com/res/v1/images/search?q=${query}&count=${count}`,
    );

    if (country) {
      url.searchParams.append("country", country);
    }

    console.log("URL:", url);
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

    // transform the results to the format expected by the client by only returning title, description, url, date, author, and imageURL
    results = results.map((result: any) => ({
      title: result.title,
      url: result.url,
      source: result.source,
      src: result.thumbnail.src,
    }));

    return results;
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
