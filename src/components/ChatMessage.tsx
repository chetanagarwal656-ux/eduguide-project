import { format } from "date-fns";
import { Sparkles } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} max-w-[65%]`}>
        {/* AI Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <div
            className={`rounded-xl px-4 py-3 ${
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          <span className={`text-[11px] text-muted-foreground ${isUser ? "text-right" : "text-left"}`}>
            {format(message.timestamp, "h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
