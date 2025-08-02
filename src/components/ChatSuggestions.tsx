import { Button } from '@/components/ui/button';

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Write a React component for a todo list",
  "Explain how async/await works in JavaScript",
  "Create a Python function to sort an array",
  "Help me debug this TypeScript error",
  "Generate a CSS animation for a loading spinner",
  "Write a SQL query to find duplicate records"
];

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Suggestions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start text-left h-auto p-3 whitespace-normal bg-chat-suggestion text-chat-suggestion-foreground hover:bg-chat-suggestion/80"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}