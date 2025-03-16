import { Brain, Search, Globe, HelpCircle, MessageSquare } from "lucide-react";

interface AgentStatusProps {
  node: string;
  status: string;
}

const nodeIcons = {
  supervisor: Brain,
  "vector-search": Search,
  "web-search": Globe,
  clarification: HelpCircle,
  conversation: MessageSquare,
};

export function AgentStatus({ node, status }: AgentStatusProps) {
  const Icon = nodeIcons[node as keyof typeof nodeIcons] || Brain;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="font-semibold capitalize">{status}</span>
    </div>
  );
} 