/**
 * MyMe App - Register Screen
 * 用户注册页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { authService } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../i18n";
import AppHeader from "../../components/AppHeader";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !username || !nickname) {
      setError(t("auth.register.required"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.register.passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.register.passwordShort"));
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(username.trim())) {
      setError(t("auth.register.usernameInvalid"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 调用真实注册API
      const response = await authService.register({
        username: username.trim(),
        email,
        password,
        confirmPassword,
        nickname: nickname.trim(),
      });
      login(response.accessToken, response.refreshToken, response.user);
    } catch (err: any) {
      setError(err.message || t("auth.register.failed"));
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
    },
    form: {
      width: "100%",
    },
    input: {
      marginBottom: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
    },
    button: {
      marginTop: 8,
      borderRadius: 8,
    },
    buttonContent: {
      paddingVertical: 8,
    },
    loginContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
    },
    loginText: {
      color: colors.textSecondary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppHeader
        title={t("auth.register.title")}
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <TextInput
            label={t("auth.register.username")}
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            placeholder={t("auth.register.usernamePlaceholder")}
          />

          <TextInput
            label={t("auth.register.email")}
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label={t("auth.register.nickname")}
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="badge-account" />}
          />

          <TextInput
            label={t("auth.register.password")}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label={t("auth.register.confirmPassword")}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t("auth.register.submit")}
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t("auth.register.hasAccount")}</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Login")}
              compact
            >
              {t("auth.register.loginNow")}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
