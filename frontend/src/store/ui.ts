import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  searchQuery: string;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  searchQuery: '',
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
