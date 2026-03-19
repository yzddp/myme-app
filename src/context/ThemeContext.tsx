import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ThemeMode,
  ThemeColors,
  getThemeColors,
  THEMES,
} from "../constants/colors";
import { useAuthStore } from "../store/authStore";
import { storage } from "../utils/storage";

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user, updateUser } = useAuthStore();
  // 从 storage 读取保存的主题，如果没有则使用默认值
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    (storage.getString("theme") as ThemeMode) || "cool",
  );

  // 监听用户主题变化，同步到本地
  useEffect(() => {
    if (user?.theme && user.theme !== themeMode) {
      setThemeModeState(user.theme as ThemeMode);
      storage.set("theme", user.theme);
    }
  }, [user?.theme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    storage.set("theme", mode);
    if (updateUser && user) {
      updateUser({ theme: mode });
    }
  };

  const toggleTheme = () => {
    const modes: ThemeMode[] = ["warm", "cool", "dark"];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const colors = getThemeColors(themeMode);

  return (
    <ThemeContext.Provider
      value={{ themeMode, colors, setThemeMode, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { THEMES, getThemeColors };
export type { ThemeMode, ThemeColors };
