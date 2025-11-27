"use client";

import { Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({ input, onInputChange, onSend, isLoading }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      onSend();
    }
  };

  return (
    <div className="p-3 md:p-4 border-t border-border">
      <div className="flex gap-2">
        <Input placeholder="Ask about forecasts, routes, inventory..." value={input} onChange={(e) => onInputChange(e.target.value)} onKeyPress={handleKeyPress} className="flex-1" disabled={isLoading} />
        <Button onClick={onSend} disabled={!input.trim() || isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
