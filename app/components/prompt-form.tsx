import { useRef, useContext } from 'react';
import { FileCollectionContext, FileCollectionContextProps } from '../contexts/file-collection-context'; // adjust the path as needed

import Textarea from '../components/textarea';
import Button from '../components/button';
import UploadButton from "./upload-button";

interface PromptFormProps {
  input: string;
  isLoading: boolean;
  scrollUser: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleScrollToBottom: () => void;
}

const PromptForm = ({input, isLoading, scrollUser, handleInputChange, handleSubmit, handleScrollToBottom}: PromptFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const {fileIsLoading} = useContext<FileCollectionContextProps>(FileCollectionContext);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading && event.key === 'Enter' || fileIsLoading && event.key === 'Enter') {
      event.preventDefault();
      return;
    };
    if (event.key === 'Enter' && !event.shiftKey && !fileIsLoading) {
      event.preventDefault();
      formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading && !fileIsLoading) {
      handleSubmit(event);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 w-full flex flex-col justify-center items-center">
      {!scrollUser && 
          <div className="relative inset-x-0 top-[-8px] w-full flex justify-center">
            <Button rounded onClick={() => {handleScrollToBottom()}} ariaLabel={"Scroll to bottom"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 13L12 18L7 13M12 6L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </Button>
          </div>
        }
      <div className="md:mx-5 md:max-w-2xl px-4 w-full space-y-4 pb-4 pt-2 shadow-lg md:rounded-t-xl md:border border-t md:border-b-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <form ref={formRef} onSubmit={handleFormSubmit} className="relative">
          <div className="flex flex-col relative max-h-60 w-full grow  rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-500 focus-within:dark:border-zinc-400 focus-within:shadow-md transition">
            <UploadButton/>
            <Textarea
              placeholder="Send a message..."
              value={input}
              onChange={handleInputChange}
              onKeyDown={(event) => handleKeyDown(event)}
              tabIndex={0}
              autoFocus
              spellCheck={false}
              autoComplete="on"
              autoCorrect="on"
              ariaLabel="message"
            />
          </div>
          <div className="absolute bottom-2 right-3">
            <Button disabled={isLoading} ariaLabel='Send message'>
            {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-zinc-950 dark:border-zinc-100"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                  <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z"></path>
                </svg>
              )} 
            </Button>
          </div>
        </form>
        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">This chatbot can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  )

}
export default PromptForm;