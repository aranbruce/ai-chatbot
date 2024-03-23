'use client';
 
import { useChat } from 'ai/react';
import Image from 'next/image';
 
export default function Chat() {
  const { messages, input, isLoading, handleInputChange, handleSubmit } = useChat();


  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event);
    }
  }
 
  return (
    <div className="flex flex-col w-full max-w-2xl pt-24 pb-40 mx-auto stretch gap-y-5 px-5">
      <>
       {messages.length === 0 ? (
        <div className="bg-background flex flex-col gap-2 rounded-lg border p-8 shadow-md">
          <h1 className="text-md font-semibold">Welcome to a demo AI chatbot with function calling!</h1>
          <p className="text-muted-foreground leading-normal">
            This is an demo chatbot app template that helps answer your chatbot perform functions like searching the web.
          </p>
        </div>
        ) : (
        messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap flex gap-x-3 md:-ml-12">
            {m.role === 'user' ? 
            (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
                <Image src={"./user-avatar.svg"} alt="user avatar" height={16} width={16}/>
              </div>
            ) : (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-primary text-primary-foreground">
                <Image src={"./ai-avatar.svg"} alt="ai avatar" height={16} width={16}/>

              </div>
            )}
            <div className="py-2 px-4 rounded-xl bg-white border">
              {m.content}
            </div>
          </div>
        ))
      )}
      </>
        <div className="fixed inset-x-0 bottom-0 w-full flex justify-center">
          <div className="mx-5 max-w-2xl px-4 w-full space-y-4 px-4 pb-8 pt-2 shadow-lg rounded-t-xl border bg-white" >
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex relative max-h-60 w-full grow flex-col overflow-hidden bg-background pr-8 rounded-md border pr-12 focus-within:ring-2">  
                <input
                  tabIndex={0}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(event) => handleKeyDown(event)}
                  placeholder="Send a message..."
                  className="w-full resize-none bg-transparent px-4 py-3 focus-within:outline-none text-md"
                  autoFocus
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                />
              </div>
              <button disabled={isLoading} className="absolute top-1/2 transform -translate-y-1/2 right-3 border inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 h-8 w-8 p-0">
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
              </button>
            </form>
          </div>
        </div>
  </div>   
  );
}