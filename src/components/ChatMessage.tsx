import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
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

  const isUser = message.role === 'user';

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all",
      isUser 
        ? "bg-chat-user text-chat-user-foreground ml-8" 
        : "bg-chat-assistant text-chat-assistant-foreground mr-8"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-primary/10" : "bg-secondary/10"
      )}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none">
          <MessageContent content={message.content} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-70">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 px-2"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Simple code block detection
  const parts = content.split(/(```[\s\S]*?```)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          return <CodeBlock key={index} content={part.slice(3, -3).trim()} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function CodeBlock({ content }: { content: string }) {
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
    <div className="relative group">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code>{content}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        onClick={copyCode}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </Button>
    </div>
  );
}