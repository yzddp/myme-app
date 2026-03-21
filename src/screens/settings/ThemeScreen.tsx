/**
 * MyMe App - Theme Screen
 * 主题设置页面 - PRD v3.0
 */

import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Card, RadioButton, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import AppHeader from "../../components/AppHeader";

type ThemeMode = "warm" | "cool" | "dark";

const THEME_CONFIG = {
  warm: {
    name: "暖色系",
    description: "奶油米黄背景，柔和橙强调",
    preview: {
      background: "#FBF9F7",
      primary: "#A68A74",
    },
  },
  cool: {
    name: "冷色系",
    description: "清透冷灰背景，灰蓝强调",
    preview: {
      background: "#F4F7F9",
      primary: "#5A7D9A",
    },
  },
  dark: {
    name: "暗色系",
    description: "深色背景，灰紫强调",
    preview: {
      background: "#121417",
      primary: "#8E9AAF",
    },
  },
};

export default function ThemeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user, updateUser } = useAuthStore();
  const { themeMode, setThemeMode, colors } = useTheme();

  const handleThemeSelect = async (selectedTheme: ThemeMode) => {
    try {
      setThemeMode(selectedTheme);
      updateUser({ ...user!, theme: selectedTheme });
      await userService.updateProfile({ theme: selectedTheme });
    } catch (error) {
      console.error("Failed to update theme:", error);
      Alert.alert("错误", "主题更新失败");
    }
  };

  const ThemeOption = ({
    theme,
    config,
    isSelected,
    onSelect,
  }: {
    theme: ThemeMode;
    config: (typeof THEME_CONFIG)[ThemeMode];
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <TouchableOpacity onPress={onSelect}>
      <Card
        style={[
          styles.themeCard,
          isSelected && styles.themeCardSelected,
          { borderColor: isSelected ? colors.primary : "transparent" },
        ]}
      >
        <Card.Content style={styles.themeCardContent}>
          <View
            style={[
              styles.themePreview,
              { backgroundColor: config.preview.background },
            ]}
          >
            <View
              style={[
                styles.themePreviewAccent,
                { backgroundColor: config.preview.primary },
              ]}
            />
          </View>
          <View style={styles.themeInfo}>
            <View style={styles.themeHeader}>
              <Text style={[styles.themeName, { color: colors.textPrimary }]}>
                {config.name}
              </Text>
              <RadioButton
                value={theme}
                status={isSelected ? "checked" : "unchecked"}
                onPress={onSelect}
                color={colors.primary}
              />
            </View>
            <Text
              style={[styles.themeDescription, { color: colors.textSecondary }]}
            >
              {config.description}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title="外观设置"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        centerTitle
      />

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          选择主题色系
        </Text>

        {(Object.keys(THEME_CONFIG) as ThemeMode[]).map((theme) => (
          <ThemeOption
            key={theme}
            theme={theme}
            config={THEME_CONFIG[theme]}
            isSelected={themeMode === theme}
            onSelect={() => handleThemeSelect(theme)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  themeCard: {
    marginBottom: 12,
    borderWidth: 2,
  },
  themeCardSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  themeCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  themePreviewAccent: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  themeInfo: {
    flex: 1,
  },
  themeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeName: {
    fontSize: 18,
    fontWeight: "600",
  },
  themeDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});
