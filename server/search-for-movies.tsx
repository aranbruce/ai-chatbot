"use server";

import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { Pinecone } from "@pinecone-database/pinecone";

// Set up Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

// Set up Pinecone index
const index = pc.index("movies-index");

interface Request {
  input: string;
  minimumIMDBRating?: number;
  minimumReleaseYear?: number;
  maximumReleaseYear?: number;
  director?: string;
  limit?: number;
}

export default async function searchFormMovies({
  input,
  minimumIMDBRating,
  minimumReleaseYear,
  maximumReleaseYear,
  director,
  limit = 5,
}: Request) {
  "use server";
  console.log("Request received for movies-vector-db action");

  if (!minimumIMDBRating) {
    minimumIMDBRating = 6;
  }

  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-ada-002"),
      value: input,
    });

    // Query the Pinecone index with the embedding
    let queryResults = await index.namespace("movie-descriptions").query({
      topK: limit,
      vector: embedding,
      includeMetadata: true,
      filter: {
        ...(minimumIMDBRating && {
          imdbRating: { $gte: minimumIMDBRating },
        }),
        ...(minimumReleaseYear && {
          releaseYear: { $gte: minimumReleaseYear },
        }),
        ...(maximumReleaseYear && {
          releaseYear: { $lte: maximumReleaseYear },
        }),
        ...(director && { director: { $eq: director } }),
      },
    });

    if (!queryResults) {
      return [];
    }

    let results = await queryResults.matches;
    results = results.map((result: any) => {
      return {
        id: result.id,
        values: result.values,
        title: result.metadata.title,
        imdbRating: result.metadata.imdbRating,
        genre: result.metadata.genre,
        releaseYear: result.metadata.releaseYear,
        director: result.metadata.director,
        imageURL: result.metadata.imageURL,
        description: result.metadata.description,
        stars: [
          result.metadata.star1,
          result.metadata.star2,
          result.metadata.star3,
          result.metadata.star4,
        ],
      };
    });

    return results as any[];
  } catch (error) {
    console.error("Error:", error);
    return { error: `Error occurred: ${error}` };
  }
}
