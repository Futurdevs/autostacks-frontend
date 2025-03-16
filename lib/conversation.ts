import axios from "./axios";

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  name?: string;
  created_at?: string;
}

export interface Conversation {
  id: string;
  title: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
  messages?: Message[];
}

export interface ConversationList {
  items: Conversation[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface ConversationCreate {
  title: string;
  user_id: number;
}

export interface ConversationUpdate {
  title?: string;
}

class ConversationService {
  private static instance: ConversationService;

  private constructor() {}

  public static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  async listConversations(page: number = 1, pageSize: number = 10): Promise<ConversationList> {
    try {
      const response = await axios.get("/chat/conversations", {
        params: {
          page,
          page_size: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error listing conversations:", error);
      throw error;
    }
  }

  async createConversation(data: ConversationCreate): Promise<Conversation> {
    try {
      const response = await axios.post("/chat/conversations", data);
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await axios.delete(`/chat/conversations/${conversationId}`);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error;
    }
  }

  async deleteAllConversations(): Promise<void> {
    try {
      await axios.delete("/chat/conversations");
    } catch (error) {
      console.error("Error deleting all conversations:", error);
      throw error;
    }
  }

  async renameConversation(conversationId: string, data: ConversationUpdate): Promise<Conversation> {
    try {
      const response = await axios.patch(
        `/chat/conversations/${conversationId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error renaming conversation:", error);
      throw error;
    }
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await axios.get(
        `/chat/conversations/${conversationId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting conversation messages:", error);
      throw error;
    }
  }
}

export const conversationService = ConversationService.getInstance(); 