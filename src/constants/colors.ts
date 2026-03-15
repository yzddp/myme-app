/**
 * MyMe App - Color Constants
 * 应用颜色主题定义 - PRD v3.0 规格
 * 统一使用主品牌色，不再使用不同颜色区分M1-M10
 */

export type ThemeMode = "warm" | "cool" | "dark";

export const THEMES = {
  warm: {
    primary: "#C87D56",
    primaryLight: "#D99B7A",
    primaryDark: "#A8653D",
    secondary: "#8FA998",
    secondaryLight: "#A8C0B2",
    secondaryDark: "#6F8A78",
    background: "#FFF8F0",
    surface: "#FFF8F0",
    surfaceVariant: "#F5EBE0",
    textPrimary: "#2D3E50",
    textSecondary: "#4A5568",
    textTertiary: "#A0AEC0",
    textOnPrimary: "#FFFFFF",
    success: "#8FA998",
    warning: "#D4A574",
    error: "#C87D56",
    info: "#7BA3C8",
    border: "rgba(150,130,110,0.15)",
    divider: "rgba(150,130,110,0.08)",
    userBubble: "#C87D56",
    agentBubble: "#FFF8F0",
    userBubbleText: "#FFFFFF",
    agentBubbleText: "#2D3E50",
    sentimentPositive: "#8FA998",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#C87D56",
  },
  cool: {
    primary: "#0077B6",
    primaryLight: "#3399CC",
    primaryDark: "#005A8C",
    secondary: "#00A86B",
    secondaryLight: "#33C08E",
    secondaryDark: "#008852",
    background: "#A9C5E0",
    surface: "#A9C5E0",
    surfaceVariant: "#94B3D0",
    textPrimary: "#FFFFFF",
    textSecondary: "#2D3E50",
    textTertiary: "#4A5568",
    textOnPrimary: "#FFFFFF",
    success: "#00A86B",
    warning: "#D4A574",
    error: "#0077B6",
    info: "#5B9BD5",
    border: "rgba(0,0,0,0.15)",
    divider: "rgba(0,0,0,0.1)",
    userBubble: "#0077B6",
    agentBubble: "#A9C5E0",
    userBubbleText: "#FFFFFF",
    agentBubbleText: "#2D3E50",
    sentimentPositive: "#00A86B",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#0077B6",
  },
  dark: {
    primary: "#BB86FC",
    primaryLight: "#D4A5FF",
    primaryDark: "#9B67DB",
    secondary: "#03DAC6",
    secondaryLight: "#3EE8D8",
    secondaryDark: "#02B5A3",
    background: "#1A1C1E",
    surface: "#1A1C1E",
    surfaceVariant: "#252629",
    textPrimary: "#E1E1E1",
    textSecondary: "#A0AEC0",
    textTertiary: "#6B7280",
    textOnPrimary: "#1A1C1E",
    success: "#03DAC6",
    warning: "#D4A574",
    error: "#BB86FC",
    info: "#7B68A8",
    border: "rgba(0,0,0,0.5)",
    divider: "rgba(0,0,0,0.3)",
    userBubble: "#BB86FC",
    agentBubble: "#252629",
    userBubbleText: "#1A1C1E",
    agentBubbleText: "#E1E1E1",
    sentimentPositive: "#03DAC6",
    sentimentNeutral: "#D4A574",
    sentimentNegative: "#BB86FC",
  },
};

export type ThemeColors = typeof THEMES.warm;

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  return THEMES[mode] || THEMES.warm;
};

export const COLORS = THEMES.warm;

export default COLORS;
