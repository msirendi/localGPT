import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultVectorStore } from "@/config/constants";

type File = {
  id: string;
  name: string;
  content: string;
};

type VectorStore = {
  id: string;
  name: string;
  files?: File[];
};

export type WebSearchConfig = {
  user_location?: {
    type: "approximate";
    country?: string;
    city?: string;
    region?: string;
  };
};

export interface ToolsState {
  webSearchEnabled: boolean;
  fileSearchEnabled: boolean;
  taskPlannerEnabled: boolean;
  vectorStore: VectorStore;
  webSearchConfig: WebSearchConfig;
}

interface StoreState {
  fileSearchEnabled: boolean;
  setFileSearchEnabled: (enabled: boolean) => void;
  webSearchEnabled: boolean;
  setWebSearchEnabled: (enabled: boolean) => void;
  taskPlannerEnabled: boolean;
  setTaskPlannerEnabled: (enabled: boolean) => void;
  vectorStore: VectorStore | null;
  setVectorStore: (store: VectorStore) => void;
  webSearchConfig: WebSearchConfig;
  setWebSearchConfig: (config: WebSearchConfig) => void;
}

const useToolsStore = create<StoreState>()(
  persist(
    (set) => ({
      vectorStore: defaultVectorStore.id !== "" ? defaultVectorStore : null,
      webSearchConfig: {
        user_location: {
          type: "approximate",
          country: "",
          city: "",
          region: "",
        },
      },
      fileSearchEnabled: false,
      setFileSearchEnabled: (enabled) => {
        set({ fileSearchEnabled: enabled });
      },
      webSearchEnabled: false,
      setWebSearchEnabled: (enabled) => {
        set({ webSearchEnabled: enabled });
      },
      setVectorStore: (store) => set({ vectorStore: store }),
      setWebSearchConfig: (config) => set({ webSearchConfig: config }),
      taskPlannerEnabled: false,
      setTaskPlannerEnabled: (enabled: boolean) => {
        set({ taskPlannerEnabled: enabled });
      },
    }),
    {
      name: "tools-store",
    }
  )
);

export default useToolsStore;
