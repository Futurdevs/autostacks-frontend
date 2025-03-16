import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { type Conversation } from "@/lib/conversation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onRenameConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
}

export function ChatSidebar({
  conversations,
  selectedConversation,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onDeleteConversation,
}: ChatSidebarProps) {
  return (
    <div className="w-80 border-r bg-background flex flex-col">
      <div className="p-4 border-b">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus size={20} />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                selectedConversation === conversation.id ? "bg-accent" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1 min-w-0"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <h3 className="font-medium truncate">{conversation.title}</h3>
                  {conversation.messages?.[0] && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.messages[0].content}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRenameConversation(conversation);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 