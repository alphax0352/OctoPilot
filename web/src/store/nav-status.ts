import { create } from 'zustand'

interface NavStatusState {
  total: number
  setTotal: (count: number) => void
  increaseTotal: () => void
  decreaseTotal: () => void
}

export const useNavStatus = create<NavStatusState>((set) => ({
  total: 1,
  setTotal: (count) => set({ total: count }),
  increaseTotal: () => set((state) => ({ total: state.total + 1 })),
  decreaseTotal: () => set((state) => ({ total: state.total - 1 })),
}))
