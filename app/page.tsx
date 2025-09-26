"use client";
import Assistant from "@/components/assistant";
import ToolsPanel from "@/components/tools-panel";
import ConversationList from "@/components/conversation-list";
import { Menu, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useConversationStore from "@/stores/useConversationStore";

export default function Main() {
  const [isToolsPanelOpen, setIsToolsPanelOpen] = useState(false);
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const router = useRouter();
  const { resetConversation } = useConversationStore();

  // After OAuth redirect, reinitialize the conversation so the next turn
  // uses the connector-enabled server configuration immediately
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isConnected = new URLSearchParams(window.location.search).get("connected");
    if (isConnected === "1") {
      resetConversation();
      router.replace("/", { scroll: false });
    }
  }, [router, resetConversation]);

  return (
    <div className="flex h-screen">
      {/* Conversation List - Desktop */}
      <div className="hidden md:block w-[25%] bg-white border-r border-gray-200">
        <ConversationList />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        <div className="flex-1">
          <Assistant />
        </div>
        
        {/* Tools Panel - Desktop */}
        <div className="hidden md:block w-[300px] bg-white border-l border-gray-200">
          <ToolsPanel />
        </div>
      </div>

      {/* Mobile Menu Buttons */}
      <div className="absolute top-4 left-4 md:hidden z-40">
        <button onClick={() => setIsConversationListOpen(true)}>
          <MessageSquare size={24} />
        </button>
      </div>
      
      <div className="absolute top-4 right-4 md:hidden z-40">
        <button onClick={() => setIsToolsPanelOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay - Conversation List */}
      {isConversationListOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black bg-opacity-30 md:hidden">
          <div className="w-[80%] bg-white h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Conversations</h2>
              <button onClick={() => setIsConversationListOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ConversationList />
          </div>
        </div>
      )}

      {/* Mobile Overlay - Tools Panel */}
      {isToolsPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-30 md:hidden">
          <div className="w-[80%] bg-white h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Tools</h2>
              <button onClick={() => setIsToolsPanelOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <ToolsPanel />
          </div>
        </div>
      )}
    </div>
  );
}
