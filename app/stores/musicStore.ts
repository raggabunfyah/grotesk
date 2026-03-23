import { create } from "zustand";

interface MusicStore {
  pauseSignal: number;
  resumeSignal: number;
  requestPause: () => void;
  requestResume: () => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
  pauseSignal: 0,
  resumeSignal: 0,
  requestPause: () => set({ pauseSignal: Date.now() }),
  requestResume: () => set({ resumeSignal: Date.now() }),
}));
