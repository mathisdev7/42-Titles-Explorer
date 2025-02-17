import { create } from "zustand"

type TitleStore = {
  page: number
  incrementPage: () => void
  resetPage: () => void
}

export const useTitleStore = create<TitleStore>((set) => ({
  page: 1,
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  resetPage: () => set({ page: 1 }),
}))
