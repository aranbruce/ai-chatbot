import { CoreMessage } from "ai";
import { createAI } from "ai/rsc";
import {
  ClientMessage,
  continueConversation,
  createExampleMessages,
  getWeatherForecastUI,
  getCurrentWeatherUI,
} from "@/server/actions";

export type AIState = {
  currentModelVariable: string;
  isFinished: boolean;
  messages: CoreMessage[];
  abortSignal?: AbortSignal;
};

export type UIState = ClientMessage[];

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  actions: {
    continueConversation,
    createExampleMessages,
    getWeatherForecastUI,
    getCurrentWeatherUI,
  },
  initialAIState: {
    currentModelVariable: "gpt-4o-mini",
    isFinished: true,
    messages: [],
  } as AIState,
  initialUIState: [] as UIState,
});
