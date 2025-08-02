import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
}: ChatSidebarProps) {
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
    </div>
  );
}

export default ChatSidebar;
