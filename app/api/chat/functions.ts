import type { ChatCompletionCreateParams } from 'openai/resources/chat';

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "search_the_web",
    description:
      "Search the web for information on a given topic or for a specific query",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to search the web for",
        },
      },
      required: ["query"],
    },
  }
];

async function search_the_web(query: string) {
  try {
    const response = await fetch(`${process.env.URL}/api/web-search?query=${query}`, {method: 'GET'});
    return await response.json();
  } catch (error) {
    console.error("error: ", error);
    return null;
  }
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "search_the_web":
      return await search_the_web(args["query"]);
    default:
      return null;
  }
}