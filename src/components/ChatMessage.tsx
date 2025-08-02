import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: number;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy message",
      });
    }
  };

  const isUser = message.role === "user";

  console.log(message);

  return (
    <div className={cn("flex gap-3 mb-6 group w-full")}>
      {/* Assistant avatar (left side) */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={16} className="text-primary-foreground" />
        </div>
      )}

      {/* Spacer for user messages to push them right */}
      {isUser && <div className="flex-1" />}

      {/* Message content */}
      <div
        className={cn(
          "max-w-[70%] space-y-2",
          isUser ? "flex flex-col items-end" : "flex flex-col items-start"
        )}
      >
        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 relative group/message break-words",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          )}
        >
          <MessageContent content={message.content} isUser={isUser} />

          {/* Copy button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className={cn(
              "absolute -top-2 opacity-0 group-hover/message:opacity-100 transition-opacity h-6 w-6 p-0 rounded-full",
              isUser
                ? "-left-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                : "-right-2 bg-background text-foreground hover:bg-background/90"
            )}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </Button>
        </div>

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs text-muted-foreground px-2",
            isUser ? "text-right" : "text-left"
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* User avatar (right side) */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
          <User size={16} className="text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

function MessageContent({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  // Simple code block detection
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          return (
            <CodeBlock
              key={index}
              content={part.slice(3, -3).trim()}
              isUser={isUser}
            />
          );
        }
        return (
          <div
            key={index}
            className="whitespace-pre-wrap break-words leading-relaxed"
          >
            {part}
          </div>
        );
      })}
    </div>
  );
}

function CodeBlock({ content, isUser }: { content: string; isUser: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy code",
      });
    }
  };

  return (
    <div className="relative group/code mt-2">
      <pre
        className={cn(
          "p-4 rounded-lg overflow-x-auto text-sm font-mono",
          isUser
            ? "bg-primary-foreground/10 text-primary-foreground"
            : "bg-background border text-foreground"
        )}
      >
        <code>{content}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyCode}
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity h-6 w-6 p-0",
          isUser
            ? "text-primary-foreground hover:bg-primary-foreground/20"
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </Button>
    </div>
  );
}
