"use client";

import { ScrollArea } from "./ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

interface MessageListProps {
  messages: Message[];
  onSuggestionClick: (suggestion: string) => void;
}

export function MessageList({ messages, onSuggestionClick }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-3 md:p-6">
      <div className="space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} onSuggestionClick={onSuggestionClick} />
        ))}
      </div>
    </ScrollArea>
  );
}
