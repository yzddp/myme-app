/**
 * MyMe App - Auth Store
 * 用户认证状态管理
 */

import { create } from "zustand";
import { storage } from "../utils/storage";
import type { User } from "../types/auth";

// 认证状态接口
interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  updateToken: (token: string) => void;
  updateUser: (updates: Partial<User>) => void;
}

// 创建认证状态管理
export const useAuthStore = create<AuthState>((set) => ({
  token: storage.getString("token") || null,
  refreshToken: storage.getString("refreshToken") || null,
  user: null,
  isAuthenticated: !!storage.getString("token"),
  isLoading: false,

  login: (token: string, refreshToken: string, user: User) => {
    storage.set("token", token);
    storage.set("refreshToken", refreshToken);
    set({
      token,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.delete("token");
    storage.delete("refreshToken");
    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  updateToken: (token: string) => {
    storage.set("token", token);
    set({ token });
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : (updates as User),
    }));
  },
}));

export default useAuthStore;
