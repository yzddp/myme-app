/**
 * MyMe App - Market Screen
 * 市场页面 - PRD v3.0 暂留空
 * 未来用于基于M1-M10数据匹配恋人、工作等场景
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

export default function MarketScreen() {
  const { colors } = useTheme();

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).content}>
        <Text style={styles(colors).title}>即将推出</Text>
        <Text style={styles(colors).subtitle}>基于您的M1-M10数据</Text>
        <Text style={styles(colors).description}>智能匹配恋人与工作</Text>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: colors.textTertiary,
    },
  });
