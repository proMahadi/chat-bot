import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Chat {
  id: string;
  title: string;
  timestamp: number;
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onApiKeySubmit: (apiKey: string) => void;
  hasApiKey: boolean;
}

export function ChatSidebar({ 
  chats, 
  currentChatId, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat,
  onApiKeySubmit,
  hasApiKey
}: ChatSidebarProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!hasApiKey);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  if (!hasApiKey && showApiKeyInput) {
    return (
      <div className="w-80 border-r bg-card p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="font-semibold">Setup Required</h2>
          </div>
          
          <form onSubmit={handleApiKeySubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium">Groq API Key</label>
              <p className="text-xs text-muted-foreground mb-2">
                Get your API key from{' '}
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  console.groq.com
                </a>
              </p>
              <Input
                type="password"
                placeholder="gsk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-chat-input"
              />
            </div>
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full">
          <Plus size={16} className="mr-2" />
          New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                currentChatId === chat.id 
                  ? "bg-primary/10 text-primary" 
                  : "hover:bg-muted"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <MessageSquare size={16} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{chat.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(chat.timestamp).toLocaleDateString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowApiKeyInput(true)}
          className="w-full"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}