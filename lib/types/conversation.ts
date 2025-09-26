export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  chatMessages: any[];
  conversationItems: any[];
}

export interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface ConversationStorage {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
}
