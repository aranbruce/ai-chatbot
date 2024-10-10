const { tavily } = require("@tavily/core");

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export default async function getWebpageContents(urls: string[]) {
  "use server";

  console.log("Request received for get webpage contents action");
  console.log("URLs: ", urls);

  try {
    if (!urls || urls.length === 0) {
      throw new Error("Invalid URL");
    }

    const response = await tvly.extract(urls);
    const results = response.results;

    return results;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
}
