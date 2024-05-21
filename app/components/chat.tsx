"use client";

import { useState, useEffect } from "react";

import { useUIState, useAIState, useActions } from "ai/rsc";
import { v4 as uuidv4 } from "uuid";
import PromptForm from "./prompt-form";
import MessageCard from "./message-card";
import EmptyScreen from "./empty-screen";
import { useScrollAnchor } from "../libs/hooks/use-scroll-anchor";

import type { ClientMessage } from "../libs/server-actions/actions";
import Select from "./select";

const modelVariableOptions = [
  {
    value: "gpt-4o",
    label: "gpt-4o",
  },
  {
    value: "gpt-4-turbo",
    label: "gpt-4-turbo",
  },
  {
    value: "gpt-3.5-turbo",
    label: "gpt-3.5-turbo",
  },
  {
    value: "gemini-1.5-pro-latest",
    label: "gemini-1.5-pro",
  },
  {
    value: "gemini-1.5-flash-latest",
    label: "gemini-1.5-flash",
  },
  {
    value: "mistral-large-latest",
    label: "mistral-large",
  },
  {
    value: "claude-3-opus-20240229",
    label: "claude-3-opus",
  },
  {
    value: "claude-3-sonnet-20240229",
    label: "claude-3-sonnet",
  },
  {
    value: "claude-3-haiku-20240307",
    label: "claude-3-haiku",
  },
];

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [history] = useAIState();
  const [messages, setMessages] = useUIState();
  const { continueConversation, submitFile } = useActions();
  const [isLoading, setIsLoading] = useState(false);
  const [modelVariable, setModelVariable] = useState(
    modelVariableOptions[0].value,
  );

  // Set loading to false when AI state is updated
  useEffect(() => {
    if (history) {
      setIsLoading(false);
      console.log("history: ", history);
    }
  }, [history]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("modelVariable: ", modelVariable);
  }, [modelVariable]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setInputValue("");

    // Add user message to UI state
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: uuidv4(),
        display: <>{inputValue}</>,
        role: "user",
      },
    ]);
    // Submit and get response message
    const response = await continueConversation(
      inputValue,
      modelVariable,
    );
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      response,
    ]);
  };

  const handleExampleClick = async (example: string) => {
    setIsLoading(true);
    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: uuidv4(),
        display: <>{example}</>,
        role: "user",
      } as ClientMessage,
    ]);
    const response = await continueConversation(example, modelVariable);
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  return (
    <div className="stretch mx-auto flex min-h-1 w-full grow flex-col items-center justify-start  bg-white dark:bg-zinc-950">
      <div className="flex w-full flex-row items-center justify-center gap-2 px-4 py-2">
        <label className="text-sm dark:text-white">Model:</label>

        <Select
          options={modelVariableOptions}
          selectedValue={modelVariable}
          setSelectedValue={setModelVariable}
        />
      </div>
      <div
        ref={scrollRef}
        className="flex h-full w-full flex-col overflow-y-scroll px-5"
      >
        <div className="stretch mx-auto flex h-full w-full max-w-2xl flex-col break-words pt-12">
          {messages.length === 0 ? (
            <EmptyScreen handleExampleClick={handleExampleClick} />
          ) : (
            <div
              ref={messagesRef}
              className="flex w-full flex-col gap-y-10 pb-10"
            >
              {messages.map((message: ClientMessage) => (
                <MessageCard
                  key={message.id}
                  id={JSON.stringify(message.id)}
                  role={message.role}
                  content={message.display}
                />
              ))}
              <div className="h-px w-full" ref={visibilityRef} />
            </div>
          )}
        </div>
      </div>
      <PromptForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
