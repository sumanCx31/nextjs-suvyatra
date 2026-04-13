// store/useSearchStore.ts
import { create } from 'zustand';

interface SearchState {
  results: any[];
  setResults: (data: any[]) => void;
}

// Ensure you have the 'export' keyword here
export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  setResults: (data) => set({ results: data }),
}));