/**
 * MyMe App - Profile Screen
 * 个人中心页面 - PRD v3.0
 */

import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Text, Avatar, Card, List, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";
import type { User } from "../../types/auth";
import type { ProfileStackParamList } from "../../navigation/types";
import { navigationRef, resetToAuth } from "../../navigation/navigationRef";

const PRESET_AVATAR_COLORS: Record<string, string> = {
  avatar_1: "#FF6B6B", avatar_2: "#4ECDC4", avatar_3: "#45B7D1",
  avatar_4: "#96CEB4", avatar_5: "#FFEAA7", avatar_6: "#DDA0DD",
  avatar_7: "#98D8C8", avatar_8: "#F7DC6F", avatar_9: "#BB8FCE",
  avatar_10: "#85C1E9", avatar_11: "#F8B500", avatar_12: "#00CED1",
};

const PRESET_AVATAR_LABELS: Record<string, string> = {
  avatar_1: "A1", avatar_2: "A2", avatar_3: "A3", avatar_4: "A4",
  avatar_5: "A5", avatar_6: "A6", avatar_7: "A7", avatar_8: "A8",
  avatar_9: "A9", avatar_10: "B1", avatar_11: "B2", avatar_12: "B3",
};

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ROW_STYLE = { minHeight: 0, paddingVertical: 6 };

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout, updateUser } = useAuthStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const loadProfile = useCallback(async () => {
    try {
      const data: User = await userService.getProfile();
      updateUser(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  }, [updateUser]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadProfile);
    return unsubscribe;
  }, [navigation, loadProfile]);

  const doLogout = () => {
    logout();
    // 如果 Zustand 响应式渲染 300ms 内没生效，主动 resetToAuth
    const timer = setTimeout(() => {
      if (navigationRef.isReady()) {
        resetToAuth();
      }
    }, 300);
  };

  const handleLogout = () => {
    Alert.alert(
      "退出登录",
      "确定要退出登录吗？",
      [
        { text: "取消", style: "cancel" },
        { text: "确定", style: "destructive", onPress: doLogout },
      ],
      { cancelable: true },
    );
  };

  const displayName =
    user?.nickname || user?.name || user?.username || "用户";
  const avatarId = user?.avatarId;
  const avatarBg = avatarId && PRESET_AVATAR_COLORS[avatarId]
    ? PRESET_AVATAR_COLORS[avatarId]
    : colors.primary;
  const avatarLabel = avatarId && PRESET_AVATAR_LABELS[avatarId]
    ? PRESET_AVATAR_LABELS[avatarId]
    : (displayName.substring(0, 2).toUpperCase() || "我");

  const mkItem = (title: string, icon: string, onPress: () => void) => (
    <List.Item
      title={title}
      titleStyle={styles.itemTitle}
      style={ROW_STYLE}
      left={(props) => (
        <List.Icon {...props} icon={icon} color={colors.primary} />
      )}
      right={(props) => (
        <List.Icon {...props} icon="chevron-right" color={colors.textTertiary} />
      )}
      onPress={onPress}
    />
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      {/* ─── 头部：头像 + 昵称 ─── */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.primary, paddingTop: insets.top + 20 },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("UserAvatar")}>
          {user?.avatarUrl ? (
            <Avatar.Image size={80} source={{ uri: user.avatarUrl }} />
          ) : (
            <Avatar.Text
              size={80}
              label={avatarLabel}
              style={{ backgroundColor: avatarBg }}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.username, { color: colors.textOnPrimary }]}>
          {displayName}
        </Text>
      </View>

      {/* ─── 菜单列表 ─── */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("我的数据", "database", () => navigation.navigate("MyData"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("资料", "account-edit", () => navigation.navigate("ProfileEdit"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("A2A关系", "account-group", () => navigation.navigate("A2AList"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("主题", "palette", () => navigation.navigate("Theme"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("通知", "bell", () => navigation.navigate("NotificationSettings"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("安全", "shield-lock", () => navigation.navigate("Security"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("意见反馈", "message-text", () => navigation.navigate("Feedback"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("关于", "information", () => navigation.navigate("About"))}
        </Card.Content>
      </Card>

      {/* ─── 退出登录按钮（用 Pressable 重做，避免 TouchableOpacity 失效问题）─── */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { backgroundColor: pressed ? "#c0392b" : colors.error },
        ]}
        onPress={handleLogout}
        android_ripple={{ color: "#c0392b" }}
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.textTertiary }]}>
        MyMe v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    padding: 32,
    paddingTop: 32,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  cardContent: {
    padding: 0,
    paddingHorizontal: 0,
  },
  itemTitle: {
    fontSize: 15,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 16,
  },
});
