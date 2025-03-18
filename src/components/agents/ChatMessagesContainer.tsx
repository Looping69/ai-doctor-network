
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Message } from "./types/agentTypes";
import ChatMessage from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessagesContainer = ({ messages, isLoading }: ChatMessagesContainerProps) => {
  // Create a ref for the messages container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change or when loading
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6 pb-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-aida-500" />
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesContainer;
