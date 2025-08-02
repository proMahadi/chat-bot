import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatSuggestions } from '@/components/ChatSuggestions';
import { ChatSidebar } from '@/components/ChatSidebar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { GroqClient } from '@/lib/groq';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const Index = () => {
  const [chats, setChats] = useLocalStorage<Chat[]>('ai-chats', []);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useLocalStorage<string>('groq-api-key', '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const groqClient = apiKey ? new GroqClient(apiKey) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const generateChatTitle = (firstMessage: string) => {
    return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !groqClient || isLoading) return;

    let targetChatId = currentChatId;

    // Create new chat if none selected
    if (!targetChatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: generateChatTitle(content),
        messages: [],
        timestamp: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      targetChatId = newChat.id;
      setCurrentChatId(targetChatId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    // Add user message
    setChats(prev => prev.map(chat => 
      chat.id === targetChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            title: chat.messages.length === 0 ? generateChatTitle(content) : chat.title
          }
        : chat
    ));

    setMessage('');
    setIsLoading(true);

    try {
      const chatHistory = currentChat?.messages || [];
      const messages = [
        { role: 'system' as const, content: 'You are a helpful AI assistant. When providing code examples, always wrap them in triple backticks (```) for proper formatting.' },
        ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user' as const, content }
      ];

      const response = await groqClient.chat(messages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setChats(prev => prev.map(chat => 
        chat.id === targetChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onApiKeySubmit={setApiKey}
        hasApiKey={!!apiKey}
      />
      
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {currentChat.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="ml-2">AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  AI Chat Assistant
                </h1>
                <p className="text-lg text-muted-foreground">
                  Powered by Meta Llama 4 Scout via Groq
                </p>
              </div>
              
              {apiKey && <ChatSuggestions onSuggestionClick={handleSuggestionClick} />}
            </div>
          </div>
        )}
        
        {apiKey && (
          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-chat-input"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !message.trim()}>
                  {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;