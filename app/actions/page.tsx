'use client'
 
import { useState, useRef, useEffect } from 'react';
import { useUIState, useAIState, useActions } from "ai/rsc";
import type { AI } from '../actions';
import PromptForm from "../components/prompt-form";
import MessageCard from "../components/message-card";
import EmptyScreen from "../components/empty-screen";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const [isLoading, setIsLoading] = useState(false);  
  
  const [keepUserAtBottom, setKeepUserAtBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Set loading to false when AI state is updated
  useEffect(() => {
    if (aiState) {
      setIsLoading(false);
    }
  }, [aiState]);

  useEffect(() => {
    const handleScroll = () => {
      const current = messagesContainerRef.current;
      if (current) {
        const atBottom = current.scrollHeight - current.scrollTop === current.clientHeight;
        setKeepUserAtBottom(atBottom);
      }
    };
    const current = messagesContainerRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (keepUserAtBottom) {
      const current = messagesContainerRef.current;
      if (current) {
        current.scrollTop = current.scrollHeight;
      }
    }
  }, [messages, keepUserAtBottom]);

  const handleScrollToBottom = () => {
    // Scroll to the bottom of the messages container smoothly
    const current = messagesContainerRef.current;
    if (current) {
      current.scrollTo({
        top: current.scrollHeight,
        behavior: 'smooth'
      });
    }
    // once animation has finished, set keepUserAtBottom to true
    setTimeout(() => {
      setKeepUserAtBottom(true);
    }, 500);
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setInputValue("");
    // Add user message to UI state
    setMessages((currentMessages: any) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <>{inputValue}</>,
        role: "user",
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessage(inputValue);
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      responseMessage,
    ]);
  }

  const handleExampleClick = async (example: string) => {
    // Add user message to UI state
    setIsLoading(true);
    setMessages((currentMessages: any) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <>{example}</>,
        role: "user",
      },
    ]);

    // Submit and get response message
    const responseMessage = await submitUserMessage(example);
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      responseMessage,
    ]);
  }
 
  return (
    <div className="bg-white dark:bg-zinc-950 flex flex-col justify-start grow items-center w-full min-h-1  mx-auto stretch">
    <div ref={messagesContainerRef} className="flex flex-col h-full w-full overflow-y-scroll px-5">
      <div className="flex flex-col max-w-2xl gap-y-10 w-full h-full pt-12 mx-auto stretch break-words">
        {messages.filter(message => message.role === "user" || message.role === "assistant").length === 0 ? (
          <EmptyScreen handleExampleClick={handleExampleClick}/>
        ) : (
          messages.map(message => (
            <MessageCard key={message.id} id={JSON.stringify(message.id)} role={message.role} content={message.display} />
          ))
        )}
      </div>
    </div>
    <PromptForm
      input={inputValue}
      isLoading={isLoading}
      keepUserAtBottom={keepUserAtBottom}
      handleInputChange={(event) => setInputValue(event.target.value)}
      handleSubmit={handleFormSubmit}
      handleScrollToBottom={handleScrollToBottom}
      />
  </div>
  )
}