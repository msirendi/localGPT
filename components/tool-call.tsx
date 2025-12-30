import React from "react";

import { ToolCallItem } from "@/lib/assistant";
import { BookOpenText, Globe, ListTodo } from "lucide-react";

interface ToolCallProps {
  toolCall: ToolCallItem;
}

function FileSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-blue-500 mb-[-16px] ml-[-8px]">
      <BookOpenText size={16} />
      <div className="text-sm font-medium mb-0.5">
        {toolCall.status === "completed"
          ? "Searched files"
          : "Searching files..."}
      </div>
    </div>
  );
}

function WebSearchCell({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-blue-500 mb-[-16px] ml-[-8px]">
      <Globe size={16} />
      <div className="text-sm font-medium">
        {toolCall.status === "completed"
          ? "Searched the web"
          : "Searching the web..."}
      </div>
    </div>
  );
}

function TaskPlannerCell({ toolCall }: ToolCallProps) {
  return (
    <div className="flex gap-2 items-center text-purple-500 mb-[-16px] ml-[-8px]">
      <ListTodo size={16} />
      <div className="text-sm font-medium">
        {toolCall.status === "completed"
          ? "Created task plan"
          : "Planning task..."}
      </div>
    </div>
  );
}

export default function ToolCall({ toolCall }: ToolCallProps) {
  return (
    <div className="flex justify-start pt-2">
      {(() => {
        switch (toolCall.tool_type) {
          case "file_search_call":
            return <FileSearchCell toolCall={toolCall} />;
          case "web_search_call":
            return <WebSearchCell toolCall={toolCall} />;
          case "function_call":
            if (toolCall.name === "task_planner") {
              return <TaskPlannerCell toolCall={toolCall} />;
            }
            return null;
          default:
            return null;
        }
      })()}
    </div>
  );
}
