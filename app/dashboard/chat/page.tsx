"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { conversationService, type Message, type Conversation } from "@/lib/conversation";
import { showToast } from "@/lib/toast";
import { useCurrentUser } from "@/hooks/auth";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { RenameDialog } from "./components/RenameDialog";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { getAuthToken } from "@/lib/cookies";

interface AgentStatus {
  node: string;
  status: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCurrentUser();
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const authToken = useMemo(getAuthToken, []);

  useEffect(() => {
    // Load conversations
    const loadConversations = async () => {
      try {
        const result = await conversationService.listConversations();
        setConversations(result.items);
      } catch (err) {
        showToast.error("Failed to load conversations", "load-conversations-error");
        console.error("Error loading conversations:", err instanceof Error ? err.message : String(err));
      }
    };

    if (user) {
      loadConversations();
    }

    const onConnect = () => {
      setIsConnected(true);
      showToast.success("Connected to chat server", "socket-connect");
    }

    const onDisconnect = () => {
      setIsConnected(false);
      showToast.error("Disconnected from chat server", "socket-connect");
    }

    const onError = (error: Error) => {
      console.error("Socket error:", error);
      showToast.error("Connection error", "socket-error");
    }

    const onMessage = (message: Message) => {
      console.log("onMessage", message);
      setMessages((prev) => [...prev, message]);
      setAgentStatus(null);
    }

    const onAgentStatus = (status: AgentStatus) => {
      console.log("onAgentStatus", status);
      setAgentStatus(status);
    }

    // Setup WebSocket
    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/general`, {
        transports: ["websocket"],
        reconnectionAttempts: 2,
        auth: {
          token: authToken
        }
      });

      socketRef.current.on("connect", onConnect);
      socketRef.current.on("disconnect", onDisconnect);
      socketRef.current.on("message", onMessage);
      socketRef.current.on("error", onError);
      socketRef.current.on("agent_status", onAgentStatus);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off("connect", onConnect);
        socketRef.current.off("disconnect", onDisconnect);
        socketRef.current.off("connect_error", onError);
        socketRef.current.off("message", onMessage);
        socketRef.current.off("error", onError);
        socketRef.current.off("agent_status", onAgentStatus);
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, [selectedConversation, user, authToken]);

  useEffect(() => {
    // Load messages when conversation is selected
    const loadMessages = async () => {
      if (!selectedConversation) return;

      try {
        setIsLoading(true);
        const messages = await conversationService.getConversationMessages(selectedConversation);
        setMessages(messages);
      } catch (err) {
        showToast.error("Failed to load messages", "load-messages");
        console.error("Error loading messages:", err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  const handleNewChat = async () => {
    try {
      const newConversation = await conversationService.createConversation({
        title: "New Chat",
        user_id: user!.id,
      });
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation.id);
    } catch (err) {
      showToast.error("Failed to create new chat", "create-chat-error");
      console.error("Error creating chat:", err instanceof Error ? err.message : String(err));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedConversation || !socketRef.current || !isConnected) return;

    const newMessage: Omit<Message, "id" | "created_at"> = {
      conversation_id: selectedConversation,
      content: inputValue,
      role: "user",
    };

    try {
      // Add the message to the UI immediately
      setMessages((prev) => [...prev, { ...newMessage, id: Date.now().toString() } as Message]);
      socketRef.current.emit("query", {
        conversation_id: selectedConversation,
        content: inputValue,
      });
      setInputValue("");
    } catch (err) {
      showToast.error("Failed to send message", "send-message-error");
      console.error("Error sending message:", err instanceof Error ? err.message : String(err));
    }
  };

  const handleRenameConversation = (conversation: Conversation) => {
    setConversationToRename(conversation);
    setNewTitle(conversation.title);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!conversationToRename || !newTitle.trim()) return;

    try {
      const updatedConversation = await conversationService.renameConversation(
        conversationToRename.id,
        { title: newTitle.trim() }
      );
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === updatedConversation.id ? updatedConversation : conv
        )
      );
      showToast.success("Conversation renamed", "rename-success");
    } catch (err) {
      showToast.error("Failed to rename conversation", "rename-error");
      console.error("Error renaming conversation:", err instanceof Error ? err.message : String(err));
    } finally {
      setIsRenameDialogOpen(false);
      setConversationToRename(null);
      setNewTitle("");
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;

    try {
      await conversationService.deleteConversation(conversationId);
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      showToast.success("Conversation deleted", "delete-success");
    } catch (err) {
      showToast.error("Failed to delete conversation", "delete-error");
      console.error("Error deleting conversation:", err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onNewChat={handleNewChat}
        onSelectConversation={setSelectedConversation}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex justify-end">
          <ConnectionStatus isConnected={isConnected} />
        </div>
        <ChatMessages 
          messages={messages} 
          agentStatus={agentStatus}
        />
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSendMessage}
          disabled={!selectedConversation || isLoading || !isConnected}
        />
      </div>

      <RenameDialog
        open={isRenameDialogOpen}
        title={newTitle}
        onOpenChange={setIsRenameDialogOpen}
        onTitleChange={setNewTitle}
        onSubmit={handleRenameSubmit}
      />
    </div>
  );
} 