/**
 * MyMe App - Login Screen
 * 用户登录页面
 */

import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/types";
import { authService } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../i18n";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { login } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError(t("auth.login.required"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 调用真实登录API
      const response = await authService.login(identifier, password);
      login(response.accessToken, response.refreshToken, response.user);
    } catch (err: any) {
      setError(err.message || t("auth.login.failed"));
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
      justifyContent: "center",
      padding: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 48,
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      color: colors.primary,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
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
    linkButton: {
      marginTop: 8,
    },
    registerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
    },
    registerText: {
      color: colors.textSecondary,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>MyMe</Text>
          <Text style={styles.subtitle}>{t("auth.login.subtitle")}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label={t("auth.login.identifier")}
            value={identifier}
            onChangeText={setIdentifier}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label={t("auth.login.password")}
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {t("auth.login.submit")}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.linkButton}
          >
            {t("auth.login.forgotPassword")}
          </Button>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t("auth.login.noAccount")}</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate("Register")}
              compact
            >
              {t("auth.login.registerNow")}
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
