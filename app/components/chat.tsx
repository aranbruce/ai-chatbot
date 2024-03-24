'use client';

import { useState, useEffect, useRef } from 'react';

import { useChat } from 'ai/react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Button from './button';
import Textarea from './textarea';
 
export default function Chat() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat();
  const [scrollUser, setScrollUser] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const current = messagesContainerRef.current;
      if (current) {
        const atBottom = current.scrollHeight - current.scrollTop === current.clientHeight;
        setScrollUser(atBottom);
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
    if (scrollUser) {
      const current = messagesContainerRef.current;
      if (current) {
        current.scrollTop = current.scrollHeight;
      }
    }
  }, [messages, scrollUser]);

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey && !isLoading) {
      handleSubmit(event);
    }
  }
 
  return (
    <div ref={messagesContainerRef} className="flex flex-col grow items-center w-full pt-24 pb-40 mx-auto stretch px-5 overflow-scroll">
      <div className="flex flex-col max-w-2xl gap-y-10 w-full mx-auto stretch">
       {messages.length === 0 ? (
        <div className="bg-background flex flex-col gap-1 rounded-lg border p-8 shadow-md">
          <h1 className="text-md font-semibold">Welcome to a demo AI chatbot with function calling!</h1>
          <p className="text-muted-foreground leading-normal">
            This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
          </p>
        </div>
        ) : (
        messages.map(m => (
          <div key={m.id} className="messages whitespace-pre-wrap flex flex-row gap-3 items-start">
            <div className="flex flex-row gap-4 items-center">
              <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
                {m.role === 'user' ? (<Image src={"./user-avatar.svg"} alt="user avatar" height={16} width={16}/>
                  ) : (
                  <Image src={"./ai-avatar.svg"} alt="ai avatar" height={16} width={16}/>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-col max-w-full">
              <h5 className="text-md font-semibold pt-1">{m.role === 'user' ? "You" : "Chatbot"}</h5>
              <ReactMarkdown>{m.content}</ReactMarkdown>
            </div>
          </div>
        ))
        )}
      </div>
      {!scrollUser && 
        <div className="fixed inset-x-0 bottom-32 w-full flex justify-center">
          <Button onClick={() => setScrollUser(true)} ariaLabel={"Scroll to bottom"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 13L12 18L7 13M12 6L12 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </Button>
        </div>
      }
      <div className="fixed inset-x-0 bottom-0 w-full flex justify-center">
        <div className="md:mx-5 md:max-w-2xl px-4 w-full space-y-4 pb-4 pt-2 shadow-lg md:rounded-t-xl border bg-white">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex relative max-h-60 w-full grow flex-col pr-14 rounded-md border border-gray-200 focus-within:border-gray-800 transition">
              <Textarea
                placeholder="Send a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(event) => handleKeyDown(event)}
                tabIndex={0}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                ariaLabel="message"
              />
            </div>
            <div className="absolute top-2 right-3">
              <Button disabled={isLoading}>
              {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                      <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z"></path>
                    </svg>
                    <span className="sr-only">Send message</span>
                  </>
                )} 
              </Button>
            </div>
          </form>
          <p className="text-xs  text-center text-gray-500">This chatbot can make mistakes. Consider checking important information.</p>
        </div>
      </div>
  </div>   
  );
}