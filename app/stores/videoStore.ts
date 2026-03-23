import { create } from "zustand";

interface VideoStore {
  isOpen: boolean;
  title: string;
  url: string;
  sessionId: number;
  openVideo: (payload: { title: string; url: string }) => void;
  closeVideo: () => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  isOpen: false,
  title: "",
  url: "",
  sessionId: 0,
  openVideo: ({ title, url }) => set({ isOpen: true, title, url, sessionId: Date.now() }),
  closeVideo: () => set({ isOpen: false, title: "", url: "", sessionId: 0 }),
}));
