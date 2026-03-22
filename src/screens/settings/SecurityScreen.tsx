/**
 * MyMe App - Security Screen
 * 账号安全设置页面 - PRD v3.0
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { userService } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import AppHeader from "../../components/AppHeader";

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword) {
      Alert.alert("错误", "请输入当前密码");
      return;
    }
    if (!newPassword) {
      Alert.alert("错误", "请输入新密码");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("错误", "新密码长度至少6位");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("错误", "两次输入的密码不一致");
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(oldPassword, newPassword);
      Alert.alert("成功", "密码已修改，请重新登录", [
        {
          text: "确定",
          onPress: () => logout(),
        },
      ]);
    } catch (error: any) {
      console.error("Failed to change password:", error);
      if (error?.status === 400 && error?.code === "INVALID_PASSWORD") {
        Alert.alert("错误", "原密码错误请重新录入");
      } else {
        Alert.alert("错误", "密码修改失败，请重试");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "注销账号",
      "注销后将清除所有数据，且无法恢复。确定要注销吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          style: "destructive",
          onPress: () => {
            Alert.alert("提示", "请联系客服注销账号");
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AppHeader
        title="账号安全"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        centerTitle
      />

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          账号信息
        </Text>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                邮箱
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {user?.email || "-"}
              </Text>
            </View>
            <Divider
              style={[styles.divider, { backgroundColor: colors.divider }]}
            />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}> 
                账号
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {user?.username || "-"}
              </Text>
            </View>
            <Divider
              style={[styles.divider, { backgroundColor: colors.divider }]}
            />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                注册时间
              </Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("zh-CN")
                  : "-"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          修改密码
        </Text>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <TextInput
              label="当前密码"
              value={oldPassword}
              onChangeText={setOldPassword}
              mode="outlined"
              secureTextEntry
              style={[styles.input, { backgroundColor: colors.surface }]}
            />
            <TextInput
              label="新密码"
              value={newPassword}
              onChangeText={setNewPassword}
              mode="outlined"
              secureTextEntry
              style={[styles.input, { backgroundColor: colors.surface }]}
            />
            <TextInput
              label="确认新密码"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={[styles.input, { backgroundColor: colors.surface }]}
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              loading={loading}
              disabled={loading}
              style={[styles.button, { backgroundColor: colors.primary }]}
            >
              修改密码
            </Button>
          </Card.Content>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          危险操作
        </Text>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Button
              mode="outlined"
              onPress={handleDeleteAccount}
              style={styles.dangerButton}
              textColor={colors.error}
            >
              注销账号
            </Button>
          </Card.Content>
        </Card>

        <Text style={[styles.tip, { color: colors.textTertiary }]}>
          为保护您的账号安全，建议定期更换密码
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  card: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
  divider: {
    height: 1,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  dangerButton: {
    borderColor: undefined,
  },
  tip: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
  },
});
