/**
 * MyMe App - Notification Settings Screen
 * 通知设置页面 - PRD v3.0
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  Switch,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { userService, NotificationSettings } from "../../services/userService";
import { useTheme } from "../../context/ThemeContext";

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    diaryReminder: true,
    aiInsight: true,
    marketing: false,
    email: true,
  });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await userService.getNotificationSettings();
      setSettings(result);
    } catch (error) {
      console.error("Failed to load notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleToggle = async (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      setSaving(true);
      await userService.updateNotificationSettings(newSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
      setSettings(settings);
      Alert.alert("错误", "设置保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.title, { color: colors.textOnPrimary }]}>
          通知设置
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text
                  style={[styles.settingTitle, { color: colors.textPrimary }]}
                >
                  日记提醒
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  每天提醒写日记
                </Text>
              </View>
              <Switch
                value={settings.diaryReminder}
                onValueChange={() => handleToggle("diaryReminder")}
                disabled={saving}
                color={colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <View style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text
                  style={[styles.settingTitle, { color: colors.textPrimary }]}
                >
                  邮件通知
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  通过邮件接收重要通知
                </Text>
              </View>
              <Switch
                value={settings.email}
                onValueChange={() => handleToggle("email")}
                disabled={saving}
                color={colors.primary}
              />
            </View>
          </Card.Content>
        </Card>

        <Text style={[styles.tip, { color: colors.textTertiary }]}>
          关闭所有通知后，您将不会收到任何推送和邮件提醒
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  tip: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
});
