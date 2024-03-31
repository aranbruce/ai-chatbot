'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat, Message } from 'ai/react';
import { v4 as uuidv4 } from 'uuid';

import PromptForm from '../components/prompt-form';
import EmptyScreen from '../components/empty-screen';
import MessageCard from '../components/message-card';
 

export default function Chat() {
  const { messages, setMessages, input, isLoading, handleInputChange, handleSubmit } = useChat({
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
          If someone asks you to search for gifs, you can use the function \`search_for_gifs\`. Try to us a variety of related search terms.
          If someone asks a question about movies, you can use the function \`search_for_movies\`.
          For gifs try to display the image as markdown and provide a link to the source with a title for the gif.
        `
      }
    ] as Message[],
  });

  const [isResponseLoading, setIsResponseLoading] = useState(false);
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

  const handleExampleClick = async (suggestion: string) => {
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: suggestion,
    };
    const updatedMessages = [...messages, userMessage] as Message[];
    setMessages(updatedMessages);
    setIsResponseLoading(true);

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
      setIsResponseLoading(false);
      return responseText;
    };
  
  return (
    <div ref={messagesContainerRef} className="bg-white dark:bg-zinc-950 flex flex-col justify-start grow items-center w-full h-full pt-12 pb-32 mx-auto stretch px-5 overflow-scroll">
      <div className="flex flex-col min-h-full max-w-2xl gap-y-10 w-full mx-auto stretch">
        {messages.filter(message => message.role === 'user' || message.role === 'assistant').length === 0 ? (
          <EmptyScreen handleExampleClick={handleExampleClick}/>
        ) : (
          messages.map(message => (
            <MessageCard key={message.id} id={message.id} role={message.role} content={message.content}/>
          ))
        )}
      </div>
      <PromptForm
        input={input}
        isLoading={isLoading || isResponseLoading}
        scrollUser={scrollUser}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleScrollToBottom={handleScrollToBottom}
      />
    </div>
  )
}