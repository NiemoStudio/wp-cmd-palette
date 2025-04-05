import { create } from "zustand";

interface CommandPaletteStore {
  close: () => void;
  isOpen: boolean;
  open: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteStore>((set) => ({
  close: () => set((state) => ({ ...state, isOpen: false })),
  isOpen: false,
  open: () => set((state) => ({ ...state, isOpen: true })),
}));

// Create global window interface
declare global {
  interface Window {
    wpCmd: {
      close: () => void;
      open: () => void;
    };
  }
}

// Initialize global functions
if (typeof window !== "undefined") {
  window.wpCmd = {
    close: () => useCommandPaletteStore.getState().close(),
    open: () => useCommandPaletteStore.getState().open(),
  };
}
