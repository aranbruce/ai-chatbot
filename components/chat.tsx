"use client";

import { useState, useEffect } from "react";

import { useUIState, useAIState, useActions } from "ai/rsc";
import { generateId } from "ai";
import PromptForm from "@/components/prompt-form";
import MessageCard from "@/components/message-card";
import EmptyScreen from "@/components/empty-screen";
import Button from "@/components/button";
import { useScrollAnchor } from "@/libs/hooks/use-scroll-anchor";
import useLocation from "@/libs/hooks/use-location";

import type { AIState, ClientMessage } from "@/server/actions";

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState();
  const [aiState, setAIState] = useAIState();

  const { continueConversation } = useActions();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { location, error, isLoaded } = useLocation();

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  async function sendMessage(message: string) {
    if (!aiState.isFinished || !message) return;
    setInputValue("");
    setAIState((AIState: AIState) => ({
      ...AIState,
      isFinished: false,
    }));

    setMessages((messages: ClientMessage[]) => [
      ...messages,
      {
        id: generateId(),
        content: <>{message}</>,
        role: "user",
      },
    ]);
    const response = await continueConversation(message, location);
    setMessages((messages: ClientMessage[]) => [...messages, response]);
  }

  return (
    <div className="h-svh w-full overflow-scroll" ref={scrollRef}>
      <div
        ref={messagesRef}
        className="mx-auto max-w-2xl px-4 pb-[200px] pt-32"
      >
        {messages.length ? (
          <>
            {messages.map((message: ClientMessage) => (
              <MessageCard
                key={message.id}
                id={JSON.stringify(message.id)}
                role={message.role}
                content={message.content}
                model={message.model}
              />
            ))}
            <div className="h-px w-full" ref={visibilityRef} />
          </>
        ) : (
          <EmptyScreen
            userLocation={location ? location : undefined}
            locationError={error ? error : undefined}
            locationIsLoaded={isLoaded}
          />
        )}
      </div>
      {!isAtBottom && messages.length && (
        <div className="fixed inset-x-0 bottom-[120px] mx-auto w-[42px] drop-shadow-sm">
          <Button
            rounded
            variant="secondary"
            onClick={() => {
              scrollToBottom();
            }}
            ariaLabel={"Scroll to bottom"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      )}
      <PromptForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={sendMessage}
      />
    </div>
  );
}
