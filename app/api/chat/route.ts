import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse, StreamData } from "ai";
import { functions, runFunction } from "./functions";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

const index = pc.index("sample-movies");

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(request: NextRequest) {
  console.log("POST request received for chat route");
  // Customise your system messages here
  const { messages } = await request.json();

  // remove ids and createdAt from messages
  const messagesWithOnlyContentAndRole = messages.map(
    ({ content, role }: { content: string; role: string }) => ({
      content,
      role,
    })
  );

  try {
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesWithOnlyContentAndRole,
      stream: true,
      functions,
      function_call: "auto",
    });

    const data = new StreamData();
    const stream = OpenAIStream(initialResponse, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages
      ) => {
        const result = await runFunction(name, args);
        const newMessages = createFunctionCallMessages(result);
        return openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          stream: true,
          messages: [...messagesWithOnlyContentAndRole, ...newMessages],
        });
      },
      onCompletion(completion) {
        // console.log('completion', completion);
      },
      onFinal() {
        data.close();
      },
    });

    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
      // return NextResponse.json({message: `Internal Server Error: ${error}`}, { status: 500 });
    }
  }
}
