import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  onLeftPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  centerTitle?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  centerTitle = true,
}: AppHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const leftNode = leftIcon ? (
    <TouchableOpacity style={styles.sideButton} onPress={onLeftPress}>
      <Icon source={leftIcon} size={24} color={colors.textOnPrimary} />
    </TouchableOpacity>
  ) : (
    <View style={styles.sideButton} />
  );

  const rightNode = rightIcon ? (
    <TouchableOpacity style={styles.sideButton} onPress={onRightPress}>
      <Icon source={rightIcon} size={24} color={colors.textOnPrimary} />
    </TouchableOpacity>
  ) : (
    <View style={styles.sideButton} />
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      {leftNode}
      <View
        style={[
          styles.titleWrap,
          centerTitle ? styles.titleCenter : styles.titleLeft,
        ]}
      >
        <Text
          style={[styles.title, { color: colors.textOnPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: colors.textOnPrimary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightNode}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    minHeight: 56,
  },
  sideButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    minHeight: 40,
    justifyContent: "center",
  },
  titleLeft: {
    flex: 1,
  },
  titleCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 2,
  },
});
