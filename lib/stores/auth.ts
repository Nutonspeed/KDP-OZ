import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { supabaseBrowser } from "../supabase";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  checkAuth: () => Promise<void>;
  login: (user: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      checkAuth: async () => {
        const { data } = await supabaseBrowser().auth.getSession();
        if (data?.session) {
          set({
            isAuthenticated: true,
            user: {
              id: data.session.user.id,
              email: data.session.user.email ?? "",
            },
          });
        } else {
          set({ isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
