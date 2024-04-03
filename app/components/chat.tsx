'use client';

import { useState, useEffect, useRef, useContext } from 'react';
import { useChat, Message } from 'ai/react';
import { v4 as uuidv4 } from 'uuid';
import { FileCollectionContext } from '../contexts/file-collection-context';

import PromptForm from '../components/prompt-form';
import EmptyScreen from '../components/empty-screen';
import MessageCard from '../components/message-card';

export default function Chat() {
  const { fileCollectionData, setFile } = useContext(FileCollectionContext);
  const { messages, setMessages, input, setInput, isLoading, handleInputChange, append } = useChat({
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
          If someone asks you to get the weather forecast or how the weather will look in the future, you can use the function \`get_weather_forecast\`.
          If someone asks you to search for gifs, you can use the function \`search_for_gifs\`. Try to us a variety of related search terms.
          If someone asks a question about movies, you can use the function \`search_for_movies\`.
          For gifs try to display the image as markdown and provide a link to the source with a title for the gif.
          When asked to analyze a file make sure to look at the most recent file provided when appropriate.
          If the user doesn't ask about the file, you can ignore it.
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
    setIsResponseLoading(true);
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: suggestion,
    } as Message;
    append(userMessage);
    setIsResponseLoading(false);
  }

  const handleFormSubmit = () => async (event: React.FormEvent<HTMLFormElement>) => {
    // append file to end of messages
    setInput("");
    const newMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
    } as Message;
    if (!fileCollectionData) {
      append(newMessage);
    } else {
      const fileMessage = {
        id: uuidv4(),
        role: "system",
        content: `
        When asked to analyze the file make sure to analyze the following data 
        provided as a document as part of your answer to the users question: 
        <fileData>${JSON.stringify(fileCollectionData)}</fileData>
        If the user doesn't ask about the file, you can ignore it.
        `,
      } as Message;
      const updatedMessages = [ ...messages, newMessage , fileMessage ] as Message[];
      setMessages(updatedMessages);
      setFile(null);
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
    }
  };
  
  return (
    <div className="bg-white dark:bg-zinc-950 flex flex-col justify-start grow items-center w-full min-h-1  mx-auto stretch">
      <div ref={messagesContainerRef} className="flex flex-col h-full w-full overflow-y-scroll px-5">
        <div className="flex flex-col max-w-2xl gap-y-10 w-full h-full pt-12 mx-auto stretch break-words">
          {messages.filter(message => message.role === 'user' || message.role === 'assistant').length === 0 ? (
            <EmptyScreen handleExampleClick={handleExampleClick}/>
          ) : (
            messages.map(message => (
              <MessageCard key={message.id} id={message.id} role={message.role} content={message.content}/>
            ))
          )}
        </div>
      </div>
      <PromptForm
        input={input}
        isLoading={isLoading || isResponseLoading}
        scrollUser={scrollUser}
        handleInputChange={handleInputChange}
        handleSubmit={handleFormSubmit()}
        handleScrollToBottom={handleScrollToBottom}
      />
    </div>
  )
}