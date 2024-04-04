import { NextRequest, NextResponse } from "next/server"; 
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
const index = pc.index("movies-index")

export const runtime = "edge";

export async function GET(request: NextRequest) {
  console.log("GET request received for movies-vector-db route")
  const input = request.nextUrl.searchParams.get("input")
  const minimumIMDBRating = request.nextUrl.searchParams.get("minimumIMDBRating")
  const minimumReleaseYear = request.nextUrl.searchParams.get("minimumReleaseYear")
  const maximumReleaseYear = request.nextUrl.searchParams.get("maximumReleaseYear")
  const director = request.nextUrl.searchParams.get("director")
  const limit = request.nextUrl.searchParams.get("limit")

  console.log("Input:", input)
  console.log("Minimum IMDB rating:", minimumIMDBRating)
  console.log("Minimum release year:", minimumReleaseYear)
  console.log("Maximum release year:", maximumReleaseYear)
  console.log("Director:", director)
  console.log("Limit:", limit)

  if (!input) {
    return NextResponse.json({error: "An input is required"}, { status: 400 })
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
    const queryResults = await index.namespace("movie-descriptions").query({
      topK: limit ? parseInt(limit) : 10,
      vector: embedding,
      // includeValues: true,
      includeMetadata: true,
      // filter: { genre: { "$eq": "action" }}
      filter: { 
        ...(minimumIMDBRating && {imdbRating: { "$gte": parseFloat(minimumIMDBRating) } }),
        ...(minimumReleaseYear && { releaseYear: { "$gte": parseInt(minimumReleaseYear) } }),
        ...(maximumReleaseYear && { releaseYear: { "$lte": parseInt(maximumReleaseYear) } }),
        ...(director && { director: { "$eq": director } }),
      }
    });

    console.log("Query results:", queryResults);

    if (!queryResults) {
      return NextResponse.json({message: "No results found"}, { status: 404 })
    }

    return NextResponse.json(queryResults, { status: 200 });
  }
  catch (error) {
    console.error("Error:", error);
    return NextResponse.json({error: `Error occurred: ${error}`}, { status: 500 });
  }
}