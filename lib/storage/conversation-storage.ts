import { Conversation } from "@/lib/types/conversation";

// In-memory storage for demo purposes - in production, use a database
class ConversationStorage {
  private conversations: Record<string, Conversation> = {};

  getAll(): Conversation[] {
    return Object.values(this.conversations);
  }

  getById(id: string): Conversation | null {
    return this.conversations[id] || null;
  }

  create(conversation: Conversation): Conversation {
    this.conversations[conversation.id] = conversation;
    return conversation;
  }

  update(id: string, updates: Partial<Conversation>): Conversation | null {
    const conversation = this.conversations[id];
    if (!conversation) return null;

    const updatedConversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.conversations[id] = updatedConversation;
    return updatedConversation;
  }

  delete(id: string): boolean {
    if (!this.conversations[id]) return false;
    delete this.conversations[id];
    return true;
  }

  exists(id: string): boolean {
    return !!this.conversations[id];
  }
}

// Singleton instance
const conversationStorage = new ConversationStorage();

export default conversationStorage;
