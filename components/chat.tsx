"use client";

import { useState, useEffect, useRef } from "react";
import type { PutBlobResult } from "@vercel/blob";

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
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

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
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }

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
    const response = blob
      ? await continueConversation(message, location, blob.url)
      : await continueConversation(message, location);

    setMessages((messages: ClientMessage[]) => [...messages, response]);
    if (blob) {
      setBlob(null);
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = inputFileRef.current?.files?.[0];
    if (file) {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;

      setBlob(newBlob);
    }
  };

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
      <PromptForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={sendMessage}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        handleFileUpload={handleFileUpload}
        inputFileRef={inputFileRef}
      />
    </div>
  );
}
