import { ToolsState, WebSearchConfig } from "@/stores/useToolsStore";

interface WebSearchTool extends WebSearchConfig {
  type: "web_search_preview";
}

export const getTools = async (toolsState: ToolsState) => {
  const {
    webSearchEnabled,
    fileSearchEnabled,
    taskPlannerEnabled,
    vectorStore,
    webSearchConfig,
  } = toolsState;

  const tools = [];

  if (webSearchEnabled) {
    const webSearchTool: WebSearchTool = {
      type: "web_search_preview",
    };
    if (
      webSearchConfig.user_location &&
      (webSearchConfig.user_location.country !== "" ||
        webSearchConfig.user_location.region !== "" ||
        webSearchConfig.user_location.city !== "")
    ) {
      webSearchTool.user_location = webSearchConfig.user_location;
    }

    tools.push(webSearchTool);
  }

  if (fileSearchEnabled) {
    const fileSearchTool = {
      type: "file_search" as const,
      vector_store_ids: [vectorStore?.id],
    };
    tools.push(fileSearchTool);
  }

  if (taskPlannerEnabled) {
    tools.push({
      type: "function" as const,
      name: "task_planner",
      description:
        "Creates a detailed, structured plan for complex tasks using chain-of-thought reasoning and self-reflection. Use this tool when the user asks to plan, organize, break down, or create a strategy for any task. The tool will analyze the task, create an initial plan, reflect on it for improvements, and return a refined, actionable plan.",
      parameters: {
        type: "object" as const,
        properties: {
          task: {
            type: "string" as const,
            description:
              "A clear description of the task or goal to create a plan for",
          },
        },
        required: ["task"],
        additionalProperties: false,
      },
      strict: true,
    });
  }

  return tools;
};
