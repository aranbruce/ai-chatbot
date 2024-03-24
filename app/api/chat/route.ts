import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { functions, runFunction } from "./functions";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Customise your system messages here
  const systemMessages = [
    {
      role: 'system',
      content: `
        You are an AI designed to help users with their queries. You can perform functions like searching the web.
        You can help users find information from the web, get the weather or find out the latest news.
        If someone asks you to search the web, you can use the function \`search_the_web\`.
        If someone asks you to get the latest news, you can use the function \`get_news\`.
        If someone asks you to get the current weather, you can use the function \`get_current_weather\`.
        If someone asks you to get the weather forecast, you can use the function \`get_weather_forecast\`.
      `
    }
  ] 
  const { messages } = await req.json();
  
  // add the system messages to the start of the messages array
  messages.unshift(...systemMessages);

  try {
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages,
      stream: true,
      functions,
      function_call: "auto",
    });

    const stream = OpenAIStream(initialResponse, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        const result = await runFunction(name, args);
        const newMessages = createFunctionCallMessages(result);
        return openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          stream: true,
          messages: [...messages, ...newMessages],
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }

}
