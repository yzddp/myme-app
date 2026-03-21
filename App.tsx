/**
 * MyMe App - Main Entry Point
 * AI驱动的数字分身应用
 */

import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { navigationRef } from "./src/navigation/navigationRef";
import { useAuthStore } from "./src/store/authStore";
import { authService } from "./src/services/authService";

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

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: colors.primary,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
      error: colors.error,
      onPrimary: colors.textOnPrimary,
      primaryContainer: colors.primaryLight,
      secondaryContainer: colors.secondaryLight,
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
            <ThemedApp />
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
