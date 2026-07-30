import { create } from "zustand"
import type { IUser } from "@/lib/types"

interface AuthState {
  user: IUser | null
  setUser: (user: IUser) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}))
