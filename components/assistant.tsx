"use client";
import React, { useEffect } from "react";
import Chat from "./chat";
import useConversationStore from "@/stores/useConversationStore";
import { Item, processMessages } from "@/lib/assistant";

export default function Assistant() {
  const { 
    chatMessages, 
    addConversationItem, 
    addChatMessage, 
    setAssistantLoading,
    currentConversationId,
    createNewConversation,
    updateCurrentConversation
  } = useConversationStore();

  // Create initial conversation if none exists
  useEffect(() => {
    const initializeConversation = async () => {
      if (!currentConversationId) {
        await createNewConversation();
      }
    };

    initializeConversation();
  }, [currentConversationId, createNewConversation]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userItem: Item = {
      type: "message",
      role: "user",
      content: [{ type: "input_text", text: message.trim() }],
    };
    const userMessage: any = {
      role: "user",
      content: message.trim(),
    };

    try {
      setAssistantLoading(true);
      addConversationItem(userMessage);
      addChatMessage(userItem);
      await processMessages();
      
      // Save conversation after processing messages
      setTimeout(() => {
        updateCurrentConversation();
      }, 1000); // Delay to ensure all messages are processed
      
    } catch (error) {
      console.error("Error processing message:", error);
    }
  };

  return (
    <div className="h-full p-4 w-full bg-white">
      <Chat
        items={chatMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
