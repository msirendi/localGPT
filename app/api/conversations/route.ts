import { NextRequest, NextResponse } from "next/server";
import { Conversation, ConversationMetadata } from "@/lib/types/conversation";
import conversationStorage from "@/lib/storage/conversation-storage";

export async function GET() {
  try {
    const allConversations = conversationStorage.getAll();
    const conversationList: ConversationMetadata[] = allConversations
      .map(conv => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        messageCount: conv.chatMessages.length
      }))
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return NextResponse.json({ conversations: conversationList });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 }
      );
    }

    const id = generateId();
    const now = new Date();
    
    const newConversation: Conversation = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      chatMessages: [{
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: "Hello! How can I help you today?" }]
      }],
      conversationItems: []
    };

    const savedConversation = conversationStorage.create(newConversation);

    return NextResponse.json({ conversation: savedConversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
