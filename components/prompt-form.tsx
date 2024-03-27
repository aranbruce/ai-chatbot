import { useRef } from 'react';

// import { useChat } from 'ai/react';

import Textarea from '@/components/textarea';
import Button from '@/components/button';
import Image from 'next/image';

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoading && event.key === 'Enter') {
      event.preventDefault();
      return;
    };
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.dispatchEvent(new Event('submit', { bubbles: true }));
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
      <div className="md:mx-5 md:max-w-2xl px-4 w-full space-y-4 pb-4 pt-2 shadow-lg md:rounded-t-xl border bg-white">
        <form ref={formRef} onSubmit={handleSubmit} className="relative">
          <div className="flex relative max-h-60 w-full grow flex-col rounded-md border border-gray-200 focus-within:border-gray-900 focus-within:ring-gray-900 focus-within:ring-2 focus-within:ring-offset-2 transition">
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
          <div className="absolute top-2 right-3">
            <Button disabled={isLoading} ariaLabel='Send message'>
            {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black"></div>
              ) : (
                <Image src={"/icons/submit.svg"} height={16} width={16} alt={"submission icon"}/>
              )} 
            </Button>
          </div>
        </form>
        <p className="text-xs  text-center text-gray-500">This chatbot can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  )

}
export default PromptForm;