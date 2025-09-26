"use client";

import React, { useEffect } from "react";
import useConversationStore from "@/stores/useConversationStore";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const getTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  return dateObj.toLocaleDateString();
};

const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    isLoadingConversations,
    createNewConversation,
    switchToConversation,
    deleteConversation,
    setConversations,
    setLoadingConversations,
  } = useConversationStore();

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoadingConversations(true);
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const { conversations: convs } = await response.json();
          setConversations(convs.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
          })));
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [setConversations, setLoadingConversations]);

  const handleNewConversation = async () => {
    await createNewConversation();
  };

  const handleConversationClick = async (id: string) => {
    if (id !== currentConversationId) {
      await switchToConversation(id);
    }
  };

  const handleDeleteConversation = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent conversation switch when deleting
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteConversation(id);
    }
  };

  if (isLoadingConversations) {
    return (
      <div className="p-4 space-y-2">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button
          onClick={handleNewConversation}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet. Create your first one!
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`
                  p-3 rounded-lg cursor-pointer group transition-colors
                  ${currentConversationId === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {conversation.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{conversation.messageCount} messages</span>
                      <span>•</span>
                      <span>
                        {getTimeAgo(conversation.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
