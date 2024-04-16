'use client'
 
import { useState, useRef, useEffect, useContext } from 'react';
import { useUIState, useAIState, useActions } from "ai/rsc";
import type { AI } from '../actions';
import PromptForm from "../components/prompt-form";
import MessageCard from "../components/message-card";
import EmptyScreen from "../components/empty-screen";
import { FileCollectionContext } from '../contexts/file-collection-context';

export default function ChatWithFunctions() {
  const [inputValue, setInputValue] = useState("");
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage, submitFile } = useActions<typeof AI>();
  const [isLoading, setIsLoading] = useState(false);
  const { fileCollection, filesAsInput, setFilesAsInput } = useContext(FileCollectionContext);

  
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
    if (filesAsInput.length === 0) {
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
    } else {
      console.log("Files as input: ", filesAsInput);
      setMessages((currentMessages: any) => [
        ...currentMessages,
        {
          id: Date.now(),
          display: 
            <div className="flex flex-col gap-4">
              {inputValue}
              {filesAsInput && (
                <div className="flex flex-col gap-2 w-full">
                {filesAsInput.map((file: any) => (
                  <div key={file.fileId} className="flex flex-row gap-2 items-center bg-white dark:bg-zinc-900 border border-zinc-10 dark:border-zinc-700 p-3 rounded-lg text-zinc-800 dark:text-zinc-300">
                    <div className="bg-zinc-800 rounded-full p-2 text-zinc-50 border border-zinc-200 dark:border-zinc-700">
                      <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </div>
                    <div className="font-medium text-sm">{file.fileName.length > 30 ? `${file.fileName.substring(0, 30)}...` : file.fileName}</div>
                  </div>
                ))}
                </div>
              )}
            </div>,
          role: "user",
        },
      ]);

      const responseMessage = await submitFile(filesAsInput, fileCollection, inputValue);
      console.log("Response message: ", responseMessage);
      setMessages((currentMessages: any[]) => [
        ...currentMessages,
        responseMessage,
      ]);
      setIsLoading(false);
      setFilesAsInput([]);
    }
  }

  const handleExampleClick = async (example: string) => {
    // Add user message to UI state
    setIsLoading(true);
    setMessages((currentMessages: any[]) => [
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