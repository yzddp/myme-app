/**
 * MyMe App - Main Entry Point
 * AI驱动的数字分身应用
 */

import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { navigationRef } from "./src/navigation/navigationRef";
import { useAuthStore } from "./src/store/authStore";
import { authService } from "./src/services/authService";
import {
  getSystemLanguage,
  LanguageProvider,
  normalizeLanguageCode,
  useLanguage,
} from "./src/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// 创建一个包装组件来使用主题
const ThemedApp = () => {
  const { themeMode, colors } = useTheme();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      setLanguage(getSystemLanguage());
      return;
    }

    if (user?.languageCode) {
      setLanguage(normalizeLanguageCode(user.languageCode));
    }
  }, [isAuthenticated, user?.languageCode, setLanguage]);

  useEffect(() => {
    if (!isAuthenticated || user) {
      return;
    }

    let cancelled = false;

    const bootstrapUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to bootstrap current user:", error);
        if (!cancelled) {
          logout();
        }
      }
    };

    void bootstrapUser();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, setUser, logout]);

  const paperBaseTheme = themeMode === "dark" ? MD3DarkTheme : MD3LightTheme;

  const theme = {
    ...paperBaseTheme,
    colors: {
      ...paperBaseTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      surfaceVariant: colors.surfaceVariant,
      error: colors.error,
      onPrimary: colors.textOnPrimary,
      onBackground: colors.textPrimary,
      onSurface: colors.textPrimary,
      onSurfaceVariant: colors.textSecondary,
      primaryContainer: colors.primaryLight,
      secondaryContainer: colors.secondaryLight,
      outline: colors.border,
      outlineVariant: colors.divider,
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <ThemedApp />
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
