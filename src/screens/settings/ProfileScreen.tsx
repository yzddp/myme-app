/**
 * MyMe App - Profile Screen
 * 个人中心页面 - PRD v3.0
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Text, Avatar, Card, Button, List, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuthStore } from "../../store/authStore";
import { userService } from "../../services/userService";
import { COLORS } from "../../constants/colors";
import type { User } from "../../types/auth";
import type { ProfileStackParamList } from "../../navigation/types";

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout, updateUser } = useAuthStore();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfileData(data);
      updateUser(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemePress = () => {
    Alert.alert("选择主题", "请选择您喜欢的主题色系", [
      {
        text: "暖色",
        onPress: () => updateTheme("warm"),
      },
      {
        text: "冷色",
        onPress: () => updateTheme("cool"),
      },
      {
        text: "暗色",
        onPress: () => updateTheme("dark"),
      },
      {
        text: "取消",
        style: "cancel",
      },
    ]);
  };

  const updateTheme = async (theme: string) => {
    try {
      await userService.updateProfile({ theme: theme as any });
      updateUser({ ...profileData!, theme: theme as any });
      Alert.alert("成功", "主题已更新");
    } catch (error) {
      console.error("Failed to update theme:", error);
      Alert.alert("错误", "主题更新失败");
    }
  };

  const handleAboutPress = () => {
    Alert.alert(
      "关于 MyMe",
      "MyMe v1.0.0\n\nAI驱动的数字分身应用\n\n让AI成为你的第二个自我",
      [{ text: "确定" }],
    );
  };

  const handleSecurityPress = () => {
    navigation.navigate("Security");
  };

  const handleNotificationPress = () => {
    navigation.navigate("NotificationSettings");
  };

  const handleDataPress = () => {
    navigation.navigate("MyData");
  };

  const handleAvatarPress = () => {
    navigation.navigate("UserAvatar");
  };

  const handleProfileEditPress = () => {
    navigation.navigate("ProfileEdit");
  };

  const handleLogout = () => {
    Alert.alert("退出登录", "确定要退出登录吗？", [
      {
        text: "取消",
        style: "cancel",
      },
      {
        text: "确定",
        onPress: () => logout(),
      },
    ]);
  };

  const getThemeLabel = (theme?: string) => {
    switch (theme) {
      case "warm":
        return "暖色";
      case "cool":
        return "冷色";
      case "dark":
        return "暗色";
      default:
        return "暖色";
    }
  };

  const getAvatarLabel = (name?: string) => {
    return name?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarPress}>
          <Avatar.Text
            size={80}
            label={getAvatarLabel(profileData?.name || user?.name || undefined)}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.username}>
          {profileData?.username || user?.name || "用户"}
        </Text>
        <Text style={styles.email}>
          {profileData?.email || user?.email || ""}
        </Text>
        {(profileData?.nickname || user?.nickname) && (
          <Text style={styles.nickname}>
            {profileData?.nickname || user?.nickname || ""}
          </Text>
        )}
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <List.Item
            title="我的数据"
            description="查看M1-M10全部数据统计"
            left={(props) => <List.Icon {...props} icon="database" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleDataPress}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <List.Item
            title="头像"
            description="更换头像"
            left={(props) => <List.Icon {...props} icon="account-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAvatarPress}
          />
          <Divider />
          <List.Item
            title="资料"
            description="编辑昵称、简介等"
            left={(props) => <List.Icon {...props} icon="account-edit" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleProfileEditPress}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <List.Item
            title="外观"
            description={`当前主题: ${getThemeLabel(profileData?.theme || user?.theme)}`}
            left={(props) => <List.Icon {...props} icon="palette" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleThemePress}
          />
          <Divider />
          <List.Item
            title="通知"
            description="消息通知设置"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleNotificationPress}
          />
          <Divider />
          <List.Item
            title="安全"
            description="账号与安全"
            left={(props) => <List.Icon {...props} icon="shield-lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleSecurityPress}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <List.Item
            title="关于"
            description="应用信息"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleAboutPress}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor={COLORS.error}
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
  username: {
    fontSize: 20,
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
  nickname: {
    fontSize: 14,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    padding: 0,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  version: {
    textAlign: "center",
    color: COLORS.textTertiary,
    fontSize: 12,
    paddingBottom: 32,
  },
});
