"use client";
import React from "react";
import FileSearchSetup from "./file-search-setup";
import WebSearchConfig from "./websearch-config";
import PanelConfig from "./panel-config";
import useToolsStore from "@/stores/useToolsStore";

export default function ContextPanel() {
  const {
    fileSearchEnabled,
    setFileSearchEnabled,
    webSearchEnabled,
    setWebSearchEnabled,
    taskPlannerEnabled,
    setTaskPlannerEnabled,
  } = useToolsStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-full p-8 w-full bg-[#f9f9f9] rounded-t-xl md:rounded-none border-l-1 border-stone-100">
      <div className="flex flex-col overflow-y-scroll h-full">
        <PanelConfig
          title="File Search"
          tooltip="Allows to search a knowledge base (vector store)"
          enabled={mounted && fileSearchEnabled}
          setEnabled={setFileSearchEnabled}
        >
          <FileSearchSetup />
        </PanelConfig>
        <PanelConfig
          title="Web Search"
          tooltip="Allows to search the web"
          enabled={mounted && webSearchEnabled}
          setEnabled={setWebSearchEnabled}
        >
          <WebSearchConfig />
        </PanelConfig>
        <PanelConfig
          title="Task Planner"
          tooltip="Plans out complex long running tasks"
          enabled={mounted && taskPlannerEnabled}
          setEnabled={setTaskPlannerEnabled}
        >
          <div className="text-sm text-stone-500 p-4">
            Generates and documents individual associated steps for complex tasks.
          </div>
        </PanelConfig>
      </div>
    </div>
  );
}
