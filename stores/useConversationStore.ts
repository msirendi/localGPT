import { create } from "zustand";
import { Item } from "@/lib/assistant";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { INITIAL_MESSAGE } from "@/config/constants";
import { Conversation, ConversationMetadata } from "@/lib/types/conversation";

interface ConversationState {
  // Current active conversation data
  chatMessages: Item[];
  conversationItems: any[];
  isAssistantLoading: boolean;
  
  // Conversation management
  conversations: ConversationMetadata[];
  currentConversationId: string | null;
  isLoadingConversations: boolean;

  // Current conversation actions
  setChatMessages: (items: Item[]) => void;
  setConversationItems: (messages: any[]) => void;
  addChatMessage: (item: Item) => void;
  addConversationItem: (message: ChatCompletionMessageParam) => void;
  setAssistantLoading: (loading: boolean) => void;
  rawSet: (state: any) => void;

  // Conversation management actions
  setConversations: (conversations: ConversationMetadata[]) => void;
  setCurrentConversationId: (id: string | null) => void;
  setLoadingConversations: (loading: boolean) => void;
  loadConversation: (conversation: Conversation) => void;
  createNewConversation: () => Promise<void>;
  switchToConversation: (id: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateCurrentConversation: () => Promise<void>;
  resetConversation: () => void;
}

const useConversationStore = create<ConversationState>((set, get) => ({
  // Current conversation state
  chatMessages: [
    {
      type: "message",
      role: "assistant",
      content: [{ type: "output_text", text: INITIAL_MESSAGE }],
    },
  ],
  conversationItems: [],
  isAssistantLoading: false,
  
  // Conversation management state
  conversations: [],
  currentConversationId: null,
  isLoadingConversations: false,

  // Current conversation actions
  setChatMessages: (items) => set({ chatMessages: items }),
  setConversationItems: (messages) => set({ conversationItems: messages }),
  addChatMessage: (item) =>
    set((state) => ({ chatMessages: [...state.chatMessages, item] })),
  addConversationItem: (message) =>
    set((state) => ({
      conversationItems: [...state.conversationItems, message],
    })),
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  rawSet: set,

  // Conversation management actions
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setLoadingConversations: (loading) => set({ isLoadingConversations: loading }),
  
  loadConversation: (conversation) => {
    set({
      chatMessages: conversation.chatMessages,
      conversationItems: conversation.conversationItems,
      currentConversationId: conversation.id,
    });
  },

  createNewConversation: async () => {
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' })
      });

      if (!response.ok) throw new Error('Failed to create conversation');

      const { conversation } = await response.json();
      
      // Update conversations list
      const { conversations } = get();
      const newConversationMetadata = {
        id: conversation.id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messageCount: conversation.chatMessages.length,
      };
      
      set({
        conversations: [newConversationMetadata, ...conversations],
        currentConversationId: conversation.id,
        chatMessages: conversation.chatMessages,
        conversationItems: conversation.conversationItems,
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  },

  switchToConversation: async (id) => {
    try {
      set({ isLoadingConversations: true });
      
      // Save current conversation first
      await get().updateCurrentConversation();
      
      const response = await fetch(`/api/conversations/${id}`);
      if (!response.ok) throw new Error('Failed to load conversation');

      const { conversation } = await response.json();
      get().loadConversation(conversation);
    } catch (error) {
      console.error('Error switching conversation:', error);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  deleteConversation: async (id) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete conversation');

      const { conversations, currentConversationId } = get();
      const updatedConversations = conversations.filter(conv => conv.id !== id);
      
      set({ conversations: updatedConversations });

      // If we deleted the current conversation, create a new one
      if (currentConversationId === id) {
        await get().createNewConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  },

  updateCurrentConversation: async () => {
    const { currentConversationId, chatMessages, conversationItems } = get();
    
    if (!currentConversationId) return;

    try {
      await fetch(`/api/conversations/${currentConversationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatMessages,
          conversationItems,
        })
      });
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  },

  resetConversation: () =>
    set(() => ({
      chatMessages: [
        {
          type: "message",
          role: "assistant",
          content: [{ type: "output_text", text: INITIAL_MESSAGE }],
        },
      ],
      conversationItems: [],
    })),
}));

export default useConversationStore;
