"use client";

import { useState, useEffect } from "react";

import { useUIState, useAIState, useActions } from "ai/rsc";
import { generateId } from "ai";
import PromptForm from "@/components/prompt-form";
import MessageList from "@/components/message-list";
import EmptyScreen from "@/components/empty-screen";
import { useScrollAnchor } from "@/libs/hooks/use-scroll-anchor";

import useFileUpload from "@/libs/hooks/use-file-upload";

import type { ClientMessage, AIState } from "@/app/ai";
import useLocation from "@/libs/hooks/use-location";

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState();
  const [aiState, setAIState] = useAIState();

  const { continueConversation } = useActions();
  const { location } = useLocation();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { fileUpload, setFileUpload, handleFileUpload, inputFileRef } =
    useFileUpload();

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  function resetFileUpload() {
    setFileUpload(null);
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
  }

  function addMessage(message: ClientMessage) {
    setMessages((messages: ClientMessage[]) => [...messages, message]);
  }

  async function sendMessage(message: string) {
    if (!aiState.isFinished || !message || fileUpload?.isUploading) return;

    resetFileUpload();
    setInputValue("");

    setAIState((AIState: AIState) => ({ ...AIState, isFinished: false }));

    addMessage({
      id: generateId(),
      role: "user",
      content: message,
      file: fileUpload ? fileUpload : undefined,
      model: aiState.currentModelVariable,
    });
    console.log("location", location);
    const response = await continueConversation(message, fileUpload);

    addMessage(response);
  }

  return (
    <div className="h-svh w-full overflow-scroll" ref={scrollRef}>
      <div
        ref={messagesRef}
        className="mx-auto max-w-2xl px-4 pb-[256px] pt-32"
      >
        {messages.length ? (
          <MessageList messages={messages} visibilityRef={visibilityRef} />
        ) : (
          <EmptyScreen />
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
        fileUpload={fileUpload}
        setFileUpload={setFileUpload}
      />
    </div>
  );
}
