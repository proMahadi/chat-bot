import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Send, Loader2, Menu } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatSuggestions } from "@/components/ChatSuggestions";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GroqClient } from "@/lib/groq";
import { toast } from "@/hooks/use-toast";
import ChatSidebar from "@/components/ChatSidebar";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const Index = () => {
  const [chats, setChats] = useLocalStorage<Chat[]>("ai-chats", []);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [apiKey] = useState("your-groq-api-key-here");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const groqClient = new GroqClient(apiKey);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const generateChatTitle = (firstMessage: string) => {
    return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Clear input immediately
    setMessage("");
    setIsLoading(true);

    let targetChatId = currentChatId;
    let currentMessages: Message[] = [];

    try {
      // Create user message
      const userMessage: Message = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        role: "user",
        timestamp: Date.now(),
      };

      // Create new chat if none exists
      if (!targetChatId) {
        targetChatId = Date.now().toString();
        setCurrentChatId(targetChatId);
        currentMessages = [userMessage];

        const newChat: Chat = {
          id: targetChatId,
          title: generateChatTitle(content),
          messages: [userMessage],
          timestamp: Date.now(),
        };

        setChats((prev) => [newChat, ...prev]);
      } else {
        // Get current chat messages
        const existingChat = chats.find((chat) => chat.id === targetChatId);
        currentMessages = existingChat
          ? [...existingChat.messages, userMessage]
          : [userMessage];

        // Update existing chat
        setChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat.id === targetChatId) {
              return {
                ...chat,
                messages: [...chat.messages, userMessage],
              };
            }
            return chat;
          });
        });
      }

      // Prepare messages for API
      const messagesForAPI = [
        {
          role: "system" as const,
          content:
            "You are a helpful AI assistant. When providing code examples, always wrap them in triple backticks (```) for proper formatting.",
        },
        ...currentMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      ];

      // Make API call
      const response = await groqClient.chat(messagesForAPI);

      if (!response || response.trim() === "") {
        throw new Error("Empty response from API");
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        content: response,
        role: "assistant",
        timestamp: Date.now(),
      };

      // Add assistant message
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat.id === targetChatId) {
            return {
              ...chat,
              messages: [...chat.messages, assistantMessage],
            };
          }
          return chat;
        });
      });
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        sendMessage(message);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - visible on lg screens and above */}
      <div className="hidden lg:flex">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
        />
      </div>

      {/* Mobile Sheet - visible on screens below lg */}
      <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
        <SheetContent side="right" className="w-80 p-0 pt-10">
          <ChatSidebar
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={(chatId) => {
              setCurrentChatId(chatId);
              setIsMobileSheetOpen(false); // Close sheet on mobile when chat is selected
            }}
            onNewChat={() => {
              createNewChat();
              setIsMobileSheetOpen(false); // Close sheet when new chat is created
            }}
            onDeleteChat={deleteChat}
          />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">AI Chat Assistant</h2>
          <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>

        {currentChat ? (
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Always show messages if they exist */}
              {currentChat.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Show loading indicator */}
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="ml-2">AI is thinking...</span>
                </div>
              )}

              {/* Show empty state only if no messages and not loading */}
              {currentChat.messages.length === 0 && !isLoading && (
                <div className="text-center text-muted-foreground py-8">
                  Start a conversation by typing a message below
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Chat Assistant
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Powered by Meta Llama 4 Scout via Groq
                </p>
              </div>

              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </div>
          </div>
        )}

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-chat-input min-h-[40px] max-h-[300px] resize-none overflow-y-auto"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !message.trim()}>
                {isLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
