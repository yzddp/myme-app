/**
 * MyMe App - Notification Settings Screen
 * 通知设置页面
 */

import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Switch, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { userService, NotificationSettings } from "../../services/userService";
import { COLORS } from "../../constants/colors";

export default function NotificationSettingsScreen() {
  const navigation = useNavigation();
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

  const SettingItem = ({
    title,
    description,
    value,
    onToggle,
  }: {
    title: string;
    description: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={saving}
        color={COLORS.primary}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>通知设置</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>推送通知</Text>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <SettingItem
              title="日记提醒"
              description="每天提醒写日记"
              value={settings.diaryReminder}
              onToggle={() => handleToggle("diaryReminder")}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <SettingItem
              title="AI洞察"
              description="接收AI分析和建议"
              value={settings.aiInsight}
              onToggle={() => handleToggle("aiInsight")}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <SettingItem
              title="营销推送"
              description="接收新功能和优惠信息"
              value={settings.marketing}
              onToggle={() => handleToggle("marketing")}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>邮件通知</Text>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <SettingItem
              title="邮件通知"
              description="通过邮件接收重要通知"
              value={settings.email}
              onToggle={() => handleToggle("email")}
            />
          </View>
        </Card>

        <Text style={styles.tip}>
          关闭所有通知后，您将不会收到任何推送和邮件提醒
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
  },
  cardContent: {
    padding: 0,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  tip: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
});
