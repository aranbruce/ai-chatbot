import { NextRequest } from "next/server"; 
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Set up Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ""
});

// Set up Pinecone index
const index = pc.index("sample-movies")

export const runtime = "edge";

export async function GET(request: NextRequest) {
  console.log("GET request received for movies-vector-db route")
  const input = request.nextUrl.searchParams.get("input")

  if (!input) {
    return new Response("An input is required", { status: 400 })
  }

  try {
    // Get the embedding for the input
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input,
      encoding_format: "float",
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Query the Pinecone index with the embedding
    const queryResults = await index.namespace("").query({
      topK: 10,
      vector: embedding,
      // includeValues: true,
      includeMetadata: true,
      // filter: { genre: { "$eq": "action" }}
    });

    if (!queryResults) {
      return new Response("No results found", { status: 404 })
    }

    return new Response(JSON.stringify(queryResults), { status: 200 });
  }
  catch (error) {
    console.error("Error:", error);
    return new Response("Error occurred", { status: 500 });
  }
}