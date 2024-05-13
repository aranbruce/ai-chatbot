"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useChat, Message } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { FileCollectionContext } from "../contexts/file-collection-context";
import { useScrollAnchor } from "../libs/useScrollAnchor";

import PromptForm from "./prompt-form";
import EmptyScreen from "./empty-screen";
import MessageCard from "./message-card";

export default function ChatWithoutActions() {
  const { fileCollection, filesAsInput, setFilesAsInput } = useContext(
    FileCollectionContext
  );
  const {
    messages,
    setMessages,
    input,
    setInput,
    isLoading,
    handleInputChange,
    append,
  } = useChat({
    initialMessages: [
      {
        id: uuidv4(),
        role: "system",
        content: `
          You are an AI designed to help users with their queries. You can perform functions like searching the web.
          You can help users find information from the web, get the weather or find out the latest news.
          If someone asks you to search the web, you can use the function \`search_the_web\`.
          If someone asks you to get the latest news, you can use the function \`get_news\`.
          If someone asks you to get the current weather, you can use the function \`get_current_weather\`.
          If someone asks you to get the weather forecast or how the weather will look in the future, you can use the function \`get_weather_forecast\`.
          If someone asks you to search for gifs, you can use the function \`search_for_gifs\`. Try to us a variety of related search terms.
          If someone asks a question about movies, you can use the function \`search_for_movies\`.
          If someone asks a question about locations or places to visit, you can use the function \`search_for_locations\`.
          For gifs, try to display the image as markdown and provide a link to the source with a title for the gif.
          For locations, try to provide a link to the location, a brief description of the location and a rating.
          When asked to analyze a file make sure to look at the most recent file provided when appropriate.
          If the user doesn't ask about the file, you can ignore it.
          `,
      },
    ] as Message[],
  });

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  const handleExampleClick = async (suggestion: string) => {
    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: suggestion,
    } as Message;
    append(userMessage);
  };

  const handleFormSubmit =
    () => async (event: React.FormEvent<HTMLFormElement>) => {
      setInput("");
      if (filesAsInput.length === 0) {
        const newMessage = {
          id: uuidv4(),
          role: "user",
          content: input,
        } as Message;
        append(newMessage);
      } else {
        // get the file data for each file in the filesAsInput array
        const fileData = filesAsInput.map((file) => {
          const fileContent = fileCollection.find(
            (fileObject) => fileObject.fileId === file.fileId
          )?.fileContent;
          return {
            fileId: file.fileId,
            fileName: file.fileName,
            fileContent,
          };
        });
        const fileMessages = [
          {
            id: uuidv4(),
            role: "user",
            content: input,
            data: {
              // create a data object for each file including its file name
              files: fileData.map((file) => ({
                fileId: file.fileId,
                fileName: file.fileName,
              })),
            },
          } as Message,
          {
            id: uuidv4(),
            role: "system",
            content: `
          Analyze the following data 
          provided as a document as part of your answer to the users question: 
          <fileData>${JSON.stringify(fileData)}</fileData>
          `,
          } as Message,
        ] as Message[];
        const updatedMessages = [...messages, ...fileMessages] as Message[];
        setMessages(updatedMessages);
        setFilesAsInput([]);
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: updatedMessages }),
        });
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let responseText = "";
        while (true) {
          if (reader) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            const decodedValue = decoder.decode(value);
            const sanitisedValue = decodedValue
              .replace(/0:"/g, "")
              .replace(/\"\n/g, "")
              .replace(/\\n/g, "\n");
            responseText += sanitisedValue;
            setMessages([
              ...updatedMessages,
              {
                id: uuidv4(),
                role: "assistant",
                content: responseText,
              },
            ]);
          }
        }
        return responseText;
      }
    };

  return (
    <div className="bg-white dark:bg-zinc-950 flex flex-col justify-start grow items-center w-full min-h-1  mx-auto stretch">
      <div
        ref={scrollRef}
        className="flex flex-col h-full w-full overflow-y-scroll px-5"
      >
        <div className="flex flex-col max-w-2xl w-full h-full pt-12 mx-auto stretch break-words">
          {messages.filter(
            (message: Message) =>
              message.role === "user" || message.role === "assistant"
          ).length === 0 ? (
            <EmptyScreen handleExampleClick={handleExampleClick} />
          ) : (
            <div
              ref={messagesRef}
              className="flex flex-col pb-10 w-full gap-y-10"
            >
              {messages.map((message: Message) => (
                <MessageCard
                  key={message.id}
                  id={JSON.stringify(message.id)}
                  role={message.role}
                  content={message.content}
                />
              ))}
              <div className="h-px w-full" ref={visibilityRef} />
            </div>
          )}
        </div>
      </div>
      <PromptForm
        input={input}
        isLoading={isLoading}
        isAtBottom={isAtBottom}
        handleInputChange={handleInputChange}
        handleSubmit={handleFormSubmit()}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
