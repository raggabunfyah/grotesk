import { create } from "zustand";

interface GalleryStore {
  isOpen: boolean;
  title: string;
  description: string;
  images: string[];
  openGallery: (payload: { title: string; description?: string; images: string[] }) => void;
  closeGallery: () => void;
}

export const useGalleryStore = create<GalleryStore>((set) => ({
  isOpen: false,
  title: "",
  description: "",
  images: [],
  openGallery: ({ title, description = "", images }) => set({ isOpen: true, title, description, images }),
  closeGallery: () => set({ isOpen: false }),
}));
