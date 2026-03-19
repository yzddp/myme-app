/**
 * MyMe App - Forgot Password Screen
 * 忘记密码页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, TextInput, Button, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { apiService } from "../../services/api";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("提示", "请输入邮箱地址");
      return;
    }
    setLoading(true);
    try {
      await apiService.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (error: any) {
      Alert.alert("发送失败", error.message || "请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Icon source="arrow-left" size={24} color={colors.textOnPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textOnPrimary }]}>
          忘记密码
        </Text>
        <View style={styles.back} />
      </View>

      <View style={styles.body}>
        {sent ? (
          <View style={styles.sentContainer}>
            <Icon source="email-check" size={64} color={colors.success} />
            <Text style={[styles.sentTitle, { color: colors.textPrimary }]}>
              重置邮件已发送
            </Text>
            <Text style={[styles.sentDesc, { color: colors.textSecondary }]}>
              请查看邮箱 {email} 中的重置密码邮件
            </Text>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              返回登录
            </Button>
          </View>
        ) : (
          <>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              输入注册时使用的邮箱，我们将发送重置密码链接
            </Text>
            <TextInput
              label="邮箱"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleSend}
              loading={loading}
              disabled={loading || !email.trim()}
              style={styles.sendBtn}
            >
              发送重置邮件
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingBottom: 12,
    paddingTop: 48,
  },
  back: { width: 40, padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  body: { flex: 1, padding: 24 },
  desc: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  input: { marginBottom: 20 },
  sendBtn: { marginTop: 4 },
  sentContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  sentTitle: { fontSize: 20, fontWeight: "bold" },
  sentDesc: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  backBtn: { marginTop: 8 },
});
