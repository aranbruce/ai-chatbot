import Markdown from "react-markdown"
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter"
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism'

import { ReactNode } from "react";

interface MessageProps {
  id: string;
  role: string;
  content: string | ReactNode | undefined;
  data?: any;
}

const MessageCard = ({id, role, content, data}:MessageProps) => {
  return (
    role === "system" ? null : 
      (
        <div key={id} className="messages whitespace-pre-wrap flex flex-row gap-3 items-start last:pb-28">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-lg text-zinc-950 dark:text-zinc-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
              {role === "assistant" ? (
                <svg fill="currentColor" viewBox="0 0 256 256" role="img" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM140.39,163a15.87,15.87,0,0,0-9.43,9.43l-19,51.46L93,172.39A15.87,15.87,0,0,0,83.61,163h0L32.15,144l51.46-19A15.87,15.87,0,0,0,93,115.61l19-51.46,19,51.46a15.87,15.87,0,0,0,9.43,9.43l51.46,19ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z">
                  </path>
                </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                    <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z">
                    </path>
                  </svg>
                )
              }
            </div>
          </div>
          <div className="flex gap-2 flex-col max-w-full">
            <h5 className="text-md text-zinc-950 dark:text-zinc-300 font-semibold pt-1">{role === "user" ? "You" : "Chatbot"}</h5>
            {data && data.files && (
              data.files.map((file: any) => (
                <div key={file.fileId} className="flex flex-row gap-2 items-center bg-white dark:bg-zinc-900 border border-zinc-10 dark:border-zinc-700 p-3 rounded-lg text-zinc-800 dark:text-zinc-300">
                  <div className="bg-zinc-800 rounded-full p-2 text-zinc-50 border border-zinc-200 dark:border-zinc-700">
                    <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                  </div>
                  <div className="font-medium text-sm">{file.fileName.length > 30 ? `${file.fileName.substring(0, 30)}...` : file.fileName}</div>
                </div>
            )))}
            <div className="text-zinc-950 dark:text-zinc-300 flex flex-col gap-4">
              {typeof content === "string" ? (
                <Markdown
                  children={content}
                  components={{
                    // Map `h1` (`# heading`) to use `h2`s.
                    h1: "h2",
                    h2 (props) {
                      const {node, ...rest} = props
                      return <h2 className="text-xl font-semibold" {...rest} />
                    },
                    h3 (props) {
                      const {node, ...rest} = props
                      return <h3 className="text-lg font-semibold" {...rest} />
                    },
                    h4 (props) {
                      const {node, ...rest} = props
                      return <h4 className="text-md font-semibold" {...rest} />
                    },
                    ol(props) {
                      const {node, ...rest} = props
                      return <ol className="flex flex-col flex-wrap gap-4" {...rest} />
                    },
                    ul(props) {
                      const {node, ...rest} = props
                      return <ul className="flex flex-col flex-wrap gap-4" {...rest} />
                    },
                    li(props) {
                      const {node, ...rest} = props
                      return <li className="" {...rest} />
                    },
                    a(props) {
                      const {node, ...rest} = props
                      return <a target="_blank" rel="noopener noreferrer" className="text-zinc-950 dark:text-zinc-50 underline focus-visible:rounded-sm focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:ring-offset-zinc-900 focus-visible:ring-2" {...rest} />
                    },
                    pre(props) {
                      const {node, ...rest} = props
                      return <pre className="grid w-full" {...rest} />
                    },
                    code(props) {
                      const {children, className, node, ...rest} = props
                      const match = /language-(\w+)/.exec(className || "")
                      const language = match ? match[1] : "text"
                      const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1).toLowerCase();
                      return match ? (
                        <div className="flex flex-col text-zinc-200 rounded-md overflow-hidden bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
                          <div className="flex justify-between relative bg-zinc-700 text-zinc:600 px-4 py-2 text-xs">
                            <div>{capitalizedLanguage}</div>
                            <button onClick={() => navigator.clipboard.writeText(String(children))}>
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            PreTag="div"
                            language={language} 
                            style={vscDarkPlus}
                            customStyle={{margin: "0", background: "none"}}
                            children={String(children).replace(/\n$/, '')}
                          />
                        </div>
                      ) : (
                        <code {...rest} className="text-sm font-semibold">
                          {children}
                        </code>
                      )
                    },
                  }}
                />
                ) : (
                content
              )}
            </div>
          </div>
        </div>
      )
  )
}

export default MessageCard;