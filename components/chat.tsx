'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { v4 as uuidv4 } from 'uuid';

import PromptForm from '@/components/prompt-form';
import EmptyScreen from '@/components/empty-screen';
import MessageCard from '@/components/message-card';
 

export default function Chat() {
  const { messages, setMessages, input, setInput, isLoading, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: uuidv4(),
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
    ] as Message[],
  });
  const [scrollUser, setScrollUser] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const exampleMessages = [
    {
      heading: "UK Prime Minister",
      subheading: 'Who is the prime minister of the UK',
      message: "Who is the prime minister of the UK"
    },
    {
      heading: "Weather",
      subheading: 'What is the weather like in London',
      message: "What is the weather like in London"
    },
    {
      heading: "News",
      subheading: 'Get the latest news about GenAI',
      message: "Get the latest news about GenAI"
    },
    {
      heading: "Search",
      subheading: 'Search for the best AI tools this year',
      message: "Search for the best AI tools this year"
    }

  ]

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

  const handleScrollToBottom = () => {
    // Scroll to the bottom of the messages container smoothly
    const current = messagesContainerRef.current;
    if (current) {
      current.scrollTo({
        top: current.scrollHeight,
        behavior: 'smooth'
      });
    }
    // once animation has finished, set scrollUser to true
    setTimeout(() => {
      setScrollUser(true);
    }, 500);
  }

  const handleSuggesstionClick = async (suggestion: string) => {
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: suggestion,
    };
    const updatedMessages = [...messages, userMessage] as Message[];
    setMessages(updatedMessages);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const reader = response.body?.getReader();
      let responseText = "";

      while (true) {
        if (reader) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          responseText += new TextDecoder().decode(value);
          setMessages([
            ...updatedMessages,
            {
              id: uuidv4(),
              role: 'assistant',
              content: responseText,
            }
          ]);
        }
      }
    return responseText;
  };
  
  return (
    <div ref={messagesContainerRef} className="flex flex-col grow items-center w-full h-full pt-24 pb-40 mx-auto stretch px-5 overflow-scroll">
      <div className="flex flex-col max-w-2xl gap-y-10 w-full mx-auto stretch">
        {messages.filter(message => message.role === 'user' || message.role === 'assistant').length === 0 ? (
          <>
            <EmptyScreen />
            <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
              {exampleMessages.map((example, index) => (
                <div
                  key={example.heading}
                  className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                    index > 1 && 'hidden md:block'
                  }`}
                  onClick={() => handleSuggesstionClick(example.message)}
                >
                  <div className="text-sm font-semibold">{example.heading}</div>
                  <div className="text-sm text-zinc-600">
                    {example.subheading}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          messages.map(message => (
            <MessageCard key={message.id} id={message.id} role={message.role} content={message.content}/>
          ))
        )}
      </div>
      <PromptForm
        input={input}
        isLoading={isLoading}
        scrollUser={scrollUser}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleScrollToBottom={handleScrollToBottom}
      />
    </div>
  )
}