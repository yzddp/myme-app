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
import { Text, Avatar, Card, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";
import type { User } from "../../types/auth";
import type { ProfileStackParamList } from "../../navigation/types";
import { navigationRef, resetToAuth } from "../../navigation/navigationRef";
import AppHeader from "../../components/AppHeader";
import { confirmAction } from "../../utils/confirm";
import { resolveAvatarUrl } from "../../utils/avatar";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

const ROW_STYLE = { minHeight: 0, paddingVertical: 6 };

const THEME_LABELS: Record<string, string> = {
  warm: "暖色系",
  cool: "冷色系",
  dark: "暗色系",
};

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

    setTimeout(() => {
      if (navigationRef.isReady()) {
        resetToAuth();
      }
    }, 300);
  };

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "退出登录",
      message: "确定要退出登录吗？",
      confirmText: "确定",
      cancelText: "取消",
      destructive: true,
    });

    if (!confirmed) {
      return;
    }

    doLogout();
  };

  const displayName = user?.nickname || user?.name || user?.username || "用户";
  const avatarLabel = displayName.substring(0, 2).toUpperCase() || "我";
  const avatarUri = resolveAvatarUrl(user?.avatar);

  const mkItem = (title: string, icon: string, onPress: () => void) => (
    <List.Item
      title={title}
      titleStyle={styles.itemTitle}
      style={ROW_STYLE}
      left={(props) => (
        <List.Icon {...props} icon={icon} color={colors.primary} />
      )}
      right={(props) => (
        <List.Icon
          {...props}
          icon="chevron-right"
          color={colors.textTertiary}
        />
      )}
      onPress={onPress}
    />
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
    >
      {/* ─── 头部 ─── */}
      <AppHeader title="我的" />

      {/* ─── 头像 + 昵称 ─── */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => navigation.navigate("UserAvatar")}>
          {avatarUri ? (
            <Avatar.Image size={80} source={{ uri: avatarUri }} />
          ) : (
            <Avatar.Text
              size={80}
              label={avatarLabel}
              style={{ backgroundColor: colors.primary }}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.username, { color: colors.textPrimary }]}>
          {displayName}
        </Text>
        <Text style={[styles.subline, { color: colors.textSecondary }]}>
          @{user?.username || "未设置用户名"}
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
          {mkItem("资料", "account-edit", () =>
            navigation.navigate("ProfileEdit"),
          )}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("主题", "palette", () => navigation.navigate("Theme"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("通知", "bell", () =>
            navigation.navigate("NotificationSettings"),
          )}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("安全", "shield-lock", () => navigation.navigate("Security"))}
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          {mkItem("意见反馈", "message-text", () =>
            navigation.navigate("Feedback"),
          )}
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
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  subline: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  infoCardContent: {
    paddingVertical: 8,
  },
  infoCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingVertical: 8,
  },
  infoRowTop: {
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 14,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
  bioText: {
    lineHeight: 20,
  },
  metaRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    marginTop: 8,
    paddingTop: 12,
    gap: 4,
  },
  metaText: {
    fontSize: 12,
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
