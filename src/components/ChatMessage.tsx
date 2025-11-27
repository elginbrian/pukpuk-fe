"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatMessage({ message, onSuggestionClick }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] md:max-w-[80%] space-y-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"} rounded-lg p-3 md:p-4`}>
        <div className="flex items-start gap-2">
          {message.role === "assistant" && <Sparkles className="h-4 w-4 text-primary mt-0.5" />}
          <div className="flex-1 space-y-2">
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Analyzing your query...</span>
              </div>
            ) : (
              <>
                <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
                {message.suggestions && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs text-muted-foreground">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <Button key={i} variant="secondary" size="sm" className="text-xs" onClick={() => onSuggestionClick(suggestion)}>
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {!message.isLoading && (
          <div className="flex items-center justify-between text-xs opacity-60">
            <span>
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {message.role === "assistant" && (
              <Badge variant="outline" className="text-xs">
                Source: AI Analytics Engine
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
