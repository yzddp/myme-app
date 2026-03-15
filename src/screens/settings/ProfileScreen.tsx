/**
 * MyMe App - Profile Screen
 * 个人中心页面
 */

import React from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Avatar, Card, Button, List, Divider } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/colors";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleSettingPress = () => {
    Alert.alert("设置", "设置功能开发中");
  };

  const handleAboutPress = () => {
    Alert.alert("关于", "MyMe v1.0.0\nAI驱动的数字分身应用");
  };

  const handlePrivacyPress = () => {
    Alert.alert("隐私政策", "隐私政策功能开发中");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.substring(0, 2).toUpperCase() || "U"}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || "用户"}</Text>
        <Text style={styles.email}>{user?.email || ""}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>知识条目</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>对话记录</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>分身</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>日记</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="设置"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSettingPress}
          />
          <Divider />
          <List.Item
            title="关于"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAboutPress}
          />
          <Divider />
          <List.Item
            title="隐私政策"
            left={(props) => <List.Icon {...props} icon="shield-check" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handlePrivacyPress}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
        textColor={COLORS.error}
      >
        退出登录
      </Button>

      <Text style={styles.version}>MyMe v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    padding: 32,
    paddingTop: 64,
    backgroundColor: COLORS.primary,
  },
  avatar: {
    backgroundColor: COLORS.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: COLORS.error,
  },
  version: {
    textAlign: "center",
    color: COLORS.textTertiary,
    fontSize: 12,
    paddingBottom: 32,
  },
});
