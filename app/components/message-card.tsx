// import ReactMarkdown from 'react-markdown';
import Markdown from 'react-markdown'


interface MessageProps {
  id: string;
  role: string;
  content: string;
}


const Message = ({id, role, content}:MessageProps) => {
  return (
    role === "system" ? null : 
      (
        <div key={id} className="messages whitespace-pre-wrap flex flex-row gap-3 items-start last:pb-40">
          <div className="flex flex-row gap-4 items-center">
            <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md text-zinc-950 dark:text-zinc-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              {role === "user" ? (
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
            <h5 className="text-md text-zinc-950 dark:text-zinc-300 font-semibold pt-1">{role === 'user' ? "You" : "Chatbot"}</h5>
            <div className="text-zinc-950 dark:text-zinc-300 flex flex-col gap-4">
              {/* <ReactMarkdown>{content}</ReactMarkdown> */}
              <Markdown
                components={{
                  // Map `h1` (`# heading`) to use `h2`s.
                  h1: 'h2',
                  ol(props) {
                    const {node, ...rest} = props
                    return <ol className="flex flex-wrap gap-4" {...rest} />
                  },
                  ul(props) {
                    const {node, ...rest} = props
                    return <ul className="flex flex-wrap gap-2" {...rest} />
                  },
                  li(props) {
                    const {node, ...rest} = props
                    return <li className="flex flex-wrap" {...rest} />
                  },
                  a(props) {
                    const {node, ...rest} = props
                    return <a target="_blank" rel="noopener noreferrer" className="text-zinc-950 dark:text-zinc-50 underline focus-visible:rounded-sm focus-visible:ring-zinc-700 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:ring-offset-zinc-900 focus-visible:ring-2" {...rest} />
                  },
                  pre(props) {
                    const {node, ...rest} = props
                    return (
                      <div className="flex flex-col relative bg-zinc-900 text-zinc-100 text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                        <div className="flex items-center relative bg-zinc-700 px-4 py-2 text-xs">Code</div>
                        <pre className="bg-zinc-800 dark:bg-zinc-90  dark:border-zinc-800 p-4 max-w-full overflow-x-auto whitespace-pre-wrap text-wrap text-sm" {...rest} />
                      </div>
                    )
                  },
                  br(props) { 
                    const {node, ...rest} = props
                    return <br className="" {...rest} />
                  },
                }}
              >{content}</Markdown>
            </div>
          </div>
        </div>
      )
  );
}

export default Message;