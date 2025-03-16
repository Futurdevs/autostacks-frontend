"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { type Message } from "@/lib/conversation";
import { AgentStatus } from "./AgentStatus";
import { Card } from "@/components/ui/card";
import { Search, Globe, Brain, User, MessageSquare, HelpCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const capabilities = [
  {
    title: "Clarity Smart Contract Expert",
    description: "Get expert help with Clarity smart contract development, debugging, and best practices.",
    icon: Brain,
  },
  {
    title: "Documentation Search",
    description: "Search through Clarity documentation for accurate, relevant information.",
    icon: Search,
  },
  {
    title: "Web Knowledge",
    description: "Access up-to-date information about Stacks blockchain and related technologies.",
    icon: Globe,
  },
];

const getMessageIcon = (message: Message) => {
  if (message.role === "user") return User;
  
  const content = message.content.toLowerCase();
  if (content.includes("search") || content.includes("found") || content.includes("documentation")) return Search;
  if (content.includes("web") || content.includes("internet") || content.includes("online")) return Globe;
  if (content.includes("clarify") || content.includes("question") || content.includes("understand")) return HelpCircle;
  if (content.includes("contract") || content.includes("code") || content.includes("clarity")) return Brain;
  return MessageSquare;
};

interface ChatMessagesProps {
  messages: Message[];
  agentStatus: { node: string; status: string; } | null;
}

export function ChatMessages({ messages, agentStatus }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to AutoStacks Chat
          </h1>
          <p className="text-xl text-muted-foreground">
            Your AI assistant for Clarity smart contract development
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {capabilities.map((capability, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <capability.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                    <p className="text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const Icon = getMessageIcon(message);
        return (
          <div
            key={message.id}
            className={cn(
              "flex flex-col max-w-[80%] space-y-2",
              message.role === "user" ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "flex items-start gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "p-2 rounded-full shrink-0",
                message.role === "user" 
                  ? "bg-primary/10 shadow-sm" 
                  : "bg-secondary shadow-sm"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  message.role === "user" ? "text-primary" : "text-foreground"
                )} />
              </div>
              <div
                className={cn(
                  "rounded-lg p-4 shadow-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border"
                )}
              >
                <div className={cn(
                  "prose prose-stone max-w-none",
                  message.role === "user" ? "prose-invert" : "prose-stone dark:prose-invert",
                  "prose-p:leading-relaxed prose-pre:bg-secondary/50 prose-pre:shadow-sm",
                  "prose-code:text-primary prose-headings:text-foreground"
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      pre: ({ ...props }) => (
                        <pre className="p-4 rounded bg-secondary/50 overflow-auto shadow-sm" {...props} />
                      ),
                      code: ({ ...props }) => (
                        <code className="rounded bg-secondary/30 px-1.5 py-0.5" {...props} />
                      ),
                      p: ({ ...props }) => (
                        <p className="mb-4 last:mb-0 leading-relaxed" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {agentStatus && (
        <div className="flex flex-col max-w-[80%] mr-auto space-y-2">
          <AgentStatus node={agentStatus.node} status={agentStatus.status} />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 