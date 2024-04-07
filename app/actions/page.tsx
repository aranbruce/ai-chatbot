'use client'
 
import { useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import type { AI } from '../action';
import PromptForm from "../components/prompt-form";
import { Message } from "ai";
 
export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInputValue("");
    // Add user message to UI state
    setMessages((currentMessages: any) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div className="w-full">{inputValue}</div>,
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

 
  return (
    <div className="bg-white dark:bg-zinc-950 flex flex-col justify-start grow items-center w-full min-h-1  mx-auto stretch">
      <div className="h-full w-full flex flex-col items-center gap-4 overflow-y-scroll pb-24">
        <div className="flex flex-col gap-4 max-w-[460px] items-start w-full pt-8">
          {
            // View messages in UI state
            messages.map((message: any) => (
              <div className="w-full flex flex-row gap-2" key={message.id}>
                <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md text-zinc-950 dark:text-zinc-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {message.role === "assistant" ? (
                  <svg fill="currentColor" viewBox="0 0 256 256" role="img" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM140.39,163a15.87,15.87,0,0,0-9.43,9.43l-19,51.46L93,172.39A15.87,15.87,0,0,0,83.61,163h0L32.15,144l51.46-19A15.87,15.87,0,0,0,93,115.61l19-51.46,19,51.46a15.87,15.87,0,0,0,9.43,9.43l51.46,19ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z">
                    </path>
                  </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                      <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z">
                      </path>
                    </svg>
                  )}
                  </div>
                {message.display}
              </div>
            ))
          }
        </div>
      </div>
      
      <PromptForm 
        input={inputValue}
        isLoading={false}
        scrollUser={false}
        handleInputChange={(event) => setInputValue(event.target.value)}
        handleSubmit={handleFormSubmit}
        handleScrollToBottom={() => {}}
      />
    </div>
  )
}