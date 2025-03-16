import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
} 