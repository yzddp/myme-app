/**
 * MyMe App - Color Constants
 * 应用颜色主题定义 - PRD v3.0 规格
 * 统一使用主品牌色，不再使用不同颜色区分M1-M10
 */

import { Appearance } from "react-native";

export type ThemeMode = "warm" | "cool" | "dark";

export const THEMES = {
  warm: {
    // 暖色系：奶油盐系 (Creamy Salt)
    primary: "#A68A74",
    primaryLight: "#BBA08E",
    primaryDark: "#8C6E5C",
    secondary: "#D4C9C0",
    secondaryLight: "#E5DDD6",
    secondaryDark: "#C4B9AE",
    background: "#FBF9F7",
    surface: "#FBF9F7",
    surfaceVariant: "#F0EBE6",
    textPrimary: "#322D29",
    textSecondary: "#6B635E",
    textTertiary: "#B8B1AC",
    textOnPrimary: "#FFFFFF",
    success: "#8FA998",
    warning: "#D4A574",
    error: "#C0392B",
    info: "#7BA3C8",
    border: "rgba(166,138,116,0.15)",
    divider: "rgba(166,138,116,0.08)",
    userBubble: "#A68A74",
    agentBubble: "#FFFFFF",
    userBubbleText: "#FFFFFF",
    agentBubbleText: "#322D29",
    sentimentPositive: "#8FA998",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#A68A74",
  },
  cool: {
    // 冷色系：冰川极简 (Glacier Minimal) - 默认
    primary: "#5A7D9A",
    primaryLight: "#7A9BB0",
    primaryDark: "#3E6078",
    secondary: "#ADC1D2",
    secondaryLight: "#C5D5E2",
    secondaryDark: "#8FA8BF",
    background: "#F4F7F9",
    surface: "#F4F7F9",
    surfaceVariant: "#E8EDF2",
    textPrimary: "#1E293B",
    textSecondary: "#475569",
    textTertiary: "#94A3B8",
    textOnPrimary: "#FFFFFF",
    success: "#00A86B",
    warning: "#D4A574",
    error: "#C0392B",
    info: "#5B9BD5",
    border: "rgba(90,125,154,0.12)",
    divider: "rgba(90,125,154,0.08)",
    userBubble: "#5A7D9A",
    agentBubble: "#FFFFFF",
    userBubbleText: "#FFFFFF",
    agentBubbleText: "#1E293B",
    sentimentPositive: "#00A86B",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#5A7D9A",
  },
  dark: {
    // 暗色系：深邃黑曜 (Obsidian Night)
    primary: "#8E9AAF",
    primaryLight: "#A8B4C4",
    primaryDark: "#6E7A8C",
    secondary: "#3E4451",
    secondaryLight: "#4E5461",
    secondaryDark: "#2E3441",
    background: "#121417",
    surface: "#121417",
    surfaceVariant: "#1E2228",
    textPrimary: "#F1F5F9",
    textSecondary: "#CBD5E1",
    textTertiary: "#94A3B8",
    textOnPrimary: "#121417",
    success: "#03DAC6",
    warning: "#D4A574",
    error: "#CF6679",
    info: "#7B68A8",
    border: "rgba(0,0,0,0.4)",
    divider: "rgba(0,0,0,0.25)",
    userBubble: "#2A2E37",
    agentBubble: "#1E2228",
    userBubbleText: "#F1F5F9",
    agentBubbleText: "#F1F5F9",
    sentimentPositive: "#03DAC6",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#8E9AAF",
  },
};

export type ThemeColors = typeof THEMES.warm;

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return THEMES[mode] || THEMES.cool;
};

// 支持系统自动切换的主题
export const getSystemTheme = (): ThemeMode => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "dark" ? "dark" : "cool";
};

// 静态默认导出，实际使用时应通过useTheme获取动态主题
export const COLORS = THEMES.cool;

export default COLORS;
