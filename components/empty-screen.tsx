"use client";

import { useEffect, useState } from "react";
import { useAIState, useActions } from "ai/rsc";

import Select from "./select";
import ExampleMessageCardGroup from "./example-message/example-message-group";
import { AIState } from "@/server/actions";

interface EmptyScreenProps {
  userLocation?: { latitude: number; longitude: number };
  locationError?: Error;
  locationIsLoaded?: boolean;
}

export default function EmptyScreen({
  userLocation,
  locationError,
  locationIsLoaded,
}: EmptyScreenProps) {
  const [examplesUI, setExamplesUI] = useState(null);
  const { createExampleMessages } = useActions();
  const [AIState, setAIState] = useAIState();

  const modelVariableOptions = [
    {
      value: "gpt-4o",
      label: "GPT 4o",
    },
    {
      value: "gpt-4-turbo",
      label: "GPT 4 Turbo",
    },
    {
      value: "gpt-3.5-turbo",
      label: "GPT 3.5 Turbo",
    },
    {
      value: "gemini-1.5-pro-latest",
      label: "Gemini 1.5 Pro",
    },
    {
      value: "gemini-1.5-flash-latest",
      label: "Gemini 1.5 Flash",
    },
    {
      value: "mistral-large-latest",
      label: "Mistral Large",
    },
    {
      value: "claude-3-opus-20240229",
      label: "Claude 3 Opus",
    },
    {
      value: "claude-3-sonnet-20240229",
      label: "Claude 3 Sonnet",
    },
    {
      value: "claude-3-haiku-20240307",
      label: "Claude 3 Haiku",
    },
  ];

  useEffect(() => {
    if (!locationIsLoaded) {
      return;
    }
    if (locationError) {
      fetchExamples(AIState.currentModelVariable);
    } else if (userLocation) {
      fetchExamples(AIState.currentModelVariable, userLocation);
    }
    async function fetchExamples(
      model: string,
      userLocation?: { latitude: number; longitude: number },
    ) {
      const exampleMessagesUI = await createExampleMessages(
        model,
        userLocation,
      );
      setExamplesUI(exampleMessagesUI);
    }
  }, [locationIsLoaded, locationError]);

  function setSelectedValue(value: string) {
    setAIState((AIState: AIState) => {
      return { ...AIState, currentModelVariable: value };
    });
  }

  return (
    <div className="flex h-full min-h-fit flex-col justify-between gap-1">
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-300">
          Select a model
        </p>
        <Select
          options={modelVariableOptions}
          selectedValue={AIState.currentModelVariable}
          setSelectedValue={setSelectedValue}
        />
      </div>
      <div className="flex h-full flex-col content-center items-center justify-center gap-8 text-center">
        <div className="flex w-full flex-col items-center justify-center gap-2 text-center">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-100">
            Hi I'm Pal
          </h1>
          <p className="text-muted-foreground leading-normal text-zinc-500 dark:text-zinc-400">
            How can I help today?
          </p>
        </div>
      </div>
      {!examplesUI ? (
        <ExampleMessageCardGroup exampleMessages={[]} />
      ) : (
        examplesUI
      )}
    </div>
  );
}
