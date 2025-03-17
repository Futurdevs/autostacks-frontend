"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { conversationService } from "@/lib/conversation";
import { showToast } from "@/lib/toast";
import { useCurrentUser } from "@/hooks/auth";
import axios from "@/lib/axios";
import { AlertCircle, Sparkles, SendHorizontal, Loader2, User, Bot } from "lucide-react";

// Project agent request/response interfaces
interface ProjectAgentRequest {
  message: string;
}

interface ProjectAgentResponse {
  response: string;
  is_complete: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { user } = useCurrentUser();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create conversation when the component mounts
  useEffect(() => {
    const createConversation = async () => {
      try {
        if (!user) return;
        
        setLoading(true);
        const conversation = await conversationService.createConversation({
          title: "New Project",
          user_id: user.id
        });
        
        setConversationId(conversation.id);
        setLoading(false);
        
        // Add welcome message from the assistant
        const welcomeMessage: ChatMessage = {
          id: "welcome",
          role: "assistant",
          content: "Hi there! I'm your AI assistant. I'll help you create a new Stacks project. What would you like to name your project?",
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error("Error creating conversation:", error);
        setError("Failed to initialize project creation. Please try again.");
        setLoading(false);
      }
    };

    if (user) {
      createConversation();
    }
  }, [user]);

  // Scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!conversationId) {
      setError("Conversation not initialized. Please refresh the page.");
      return;
    }

    if (!inputMessage.trim()) {
      return;
    }

    try {
      setError(null);
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: inputMessage,
        timestamp: new Date()
      };
      
      // Clear input and add user message to the chat
      setInputMessage("");
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Add a loading message from the assistant
      const loadingMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true
      };
      
      setMessages(prevMessages => [...prevMessages, loadingMessage]);
      
      // Send message to the project agent
      const response = await axios.post<ProjectAgentResponse>(
        `/project/new/${conversationId}`,
        { message: inputMessage } as ProjectAgentRequest
      );

      // Remove the loading message and add the real response
      setMessages(prevMessages => {
        const filteredMessages = prevMessages.filter(msg => !msg.isLoading);
        return [...filteredMessages, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.data.response,
          timestamp: new Date()
        }];
      });
      
      // Check if the project creation process is complete
      if (response.data.is_complete) {
        setIsComplete(true);
        showToast.success("Project creation complete!", "project-create");
        // Add a final message with navigation option
        setMessages(prevMessages => [...prevMessages, {
          id: `completion-${Date.now()}`,
          role: "assistant",
          content: "Your project has been created successfully! You can now go to your project dashboard to see it.",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
      // Remove the loading message
      setMessages(prevMessages => prevMessages.filter(msg => !msg.isLoading));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading && !isComplete) {
      handleSendMessage();
    }
  };

  const goToProject = () => {
    if (conversationId) {
      router.push(`/dashboard/projects/${conversationId}`);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">BETA</span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-4 mb-6 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Chat</CardTitle>
          <CardDescription>
            Chat with our AI assistant to create your new Stacks project
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] overflow-y-auto flex flex-col p-4">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <p>Initializing project chat...</p>
            </div>
          ) : (
            <div className="space-y-4 w-full">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[80%] flex items-start gap-3
                      ${message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-12' 
                        : 'bg-muted text-muted-foreground mr-12'}`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 mt-1 flex-shrink-0" />
                    ) : (
                      <Bot className="h-5 w-5 mt-1 flex-shrink-0" />
                    )}
                    
                    {message.isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t p-4">
          {isComplete ? (
            <Button 
              onClick={goToProject}
              className="w-full"
            >
              Go to Project Dashboard
            </Button>
          ) : (
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || !conversationId}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={loading || !conversationId || !inputMessage.trim()}
                size="icon"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">
              Project Created!
            </CardTitle>
            <CardDescription>
              Your project has been created successfully. You can go to the project dashboard to continue.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={goToProject}
              className="w-full"
            >
              Go to Project Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
} 