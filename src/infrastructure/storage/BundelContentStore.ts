import { ReactNode } from "react";
import { create } from "zustand";

interface Bundle {
  selectedBundles: any;
  content?: ReactNode;
  setContent: (content: ReactNode) => void;
  resetContent: () => void;
}
export const useBundleContentStore = create<Bundle>((set) => ({
  content: undefined,
  setContent: (content: ReactNode) => set({ content }),
  resetContent: () => set({ content: undefined }),
}));
