import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

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
            <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-md border shadow-sm bg-background">
              {role === "user" ? (
                <Image src={"./icons/user-avatar.svg"} alt="user avatar" height={16} width={16}/>
                ) : role === "assistant" ? (
                <Image src={"./icons/ai-avatar.svg"} alt="ai avatar" height={16} width={16}/>
                ) : null
              }
            </div>
          </div>
          <div className="flex gap-2 flex-col max-w-full">
            <h5 className="text-md font-semibold pt-1">{role === 'user' ? "You" : "Chatbot"}</h5>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )
  );
}

export default Message;