import MessageCard from "@/components/message-card";
import type { ClientMessage } from "@/server/actions";

interface MessageListProps {
  messages: ClientMessage[];
  visibilityRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  visibilityRef,
}) => (
  <>
    {messages.map((message: ClientMessage) => (
      <MessageCard
        key={message.id}
        id={JSON.stringify(message.id)}
        role={message.role}
        content={message.content}
        file={message.file}
        model={message.model}
      />
    ))}
    <div className="h-px w-full" ref={visibilityRef} />
  </>
);

export default MessageList;
