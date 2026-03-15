/**
 * MyMe App - Main Entry Point
 * AI驱动的数字分身应用
 */

import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";

import { useAuthStore } from "./src/store/authStore";
import { THEMES, ThemeMode } from "./src/constants/colors";
import AppNavigator from "./src/navigation/AppNavigator";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  const { user, isAuthenticated } = useAuthStore();
  const [themeMode, setThemeMode] = useState<ThemeMode>("cool");

  useEffect(() => {
    if (isAuthenticated && user?.theme) {
      setThemeMode(user.theme as ThemeMode);
    } else {
      setThemeMode("cool");
    }
  }, [isAuthenticated, user?.theme]);

  const COLORS = THEMES[themeMode];

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      background: COLORS.background,
      surface: COLORS.surface,
      error: COLORS.error,
      onPrimary: COLORS.textOnPrimary,
      primaryContainer: COLORS.primaryLight,
      secondaryContainer: COLORS.secondaryLight,
    },
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
              <AppNavigator />
            </NavigationContainer>
          </PaperProvider>
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
