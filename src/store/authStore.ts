import { create } from "zustand";

interface User {
  id: string;
  codename: string;
  avatar_emoji: string;
  total_score: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user:  JSON.parse(localStorage.getItem("pd_user")  ?? "null"),
  token: localStorage.getItem("pd_token"),

  login: (user, token) => {
    localStorage.setItem("pd_user",  JSON.stringify(user));
    localStorage.setItem("pd_token", token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("pd_user");
    localStorage.removeItem("pd_token");
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));