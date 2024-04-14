import { useRef, useContext } from 'react';
import { FileCollectionContext, FileCollectionContextProps } from '../contexts/file-collection-context'; // adjust the path as needed

import Textarea from '../components/textarea';
import Button from '../components/button';
import UploadButton from "../components/upload-button";

interface PromptFormProps {
  input: string;
  isLoading: boolean;
  keepUserAtBottom: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleScrollToBottom: () => void;
}

const PromptForm = ({input, isLoading, keepUserAtBottom, handleInputChange, handleSubmit, handleScrollToBottom}: PromptFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const {filesAsInput} = useContext<FileCollectionContextProps>(FileCollectionContext);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading && event.key === 'Enter' || 
    filesAsInput.some(file => file.isUploading) && event.key === 'Enter') {
      event.preventDefault();
      return;
    };
    if (event.key === 'Enter' && !event.shiftKey && !filesAsInput.some(file => file.isUploading)) {
      event.preventDefault();
      formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading && !filesAsInput.some(file => file.isUploading)) {
      handleSubmit(event);
    }
  }

  return (
    <div className="relative w-full flex flex-col justify-center items-center">
      {!keepUserAtBottom && 
        <div className="absolute inset-x-0 top-[-54px] w-full flex justify-center">
          <Button rounded variant="secondary" onClick={() => {handleScrollToBottom()}} ariaLabel={"Scroll to bottom"}>
            <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </Button>
        </div>
      }
      <div className="md:mx-5 md:max-w-2xl px-4 w-full space-y-4 pb-4 pt-2 bg-white dark:bg-zinc-950">
        <form ref={formRef} onSubmit={handleFormSubmit} className="relative">
          <div className="flex flex-col relative pr-1 overflow-hidden w-full grow rounded-[1.75rem] bg-zinc-100 dark:bg-zinc-900 focus-within:ring-[2px] ring-slate-950/20 dark:ring-slate-400 ring-offset-0 transition has-[button:focus]:ring-0">
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
              required={filesAsInput.length === 0 ?? false}
            />
          </div>
          <div className="absolute bottom-[0.375rem] right-3">
            <Button variant="secondary" rounded disabled={isLoading || input.length === 0 && filesAsInput.some(file => file.isUploading) || filesAsInput.some(file => file.isUploading)} ariaLabel='Send message'>
                <svg width="18" height="18" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M7.14645 2.14645C7.34171 1.95118 7.65829 1.95118 7.85355 2.14645L11.8536 6.14645C12.0488 6.34171 12.0488 6.65829 11.8536 6.85355C11.6583 7.04882 11.3417 7.04882 11.1464 6.85355L8 3.70711L8 12.5C8 12.7761 7.77614 13 7.5 13C7.22386 13 7 12.7761 7 12.5L7 3.70711L3.85355 6.85355C3.65829 7.04882 3.34171 7.04882 3.14645 6.85355C2.95118 6.65829 2.95118 6.34171 3.14645 6.14645L7.14645 2.14645Z" />
                </svg>
            </Button>
          </div>
        </form>
        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">This chatbot can make mistakes. Consider checking information.</p>
      </div>
    </div>
  )

}
export default PromptForm;