/**
 * MyMe App - About Screen
 * 关于页面 - PRD v3.0
 */

import React from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import {
  Text,
  Card,
  List,
  Divider,
  Button,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";

export default function AboutScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      color: colors.textOnPrimary,
    },
    content: {
      padding: 16,
    },
    logoSection: {
      alignItems: "center",
      marginBottom: 24,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    logoText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textOnPrimary,
    },
    appName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    slogan: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    version: {
      fontSize: 12,
      color: colors.textTertiary,
      marginTop: 8,
    },
    card: {
      marginBottom: 16,
      backgroundColor: colors.surface,
    },
    cardContent: {
      padding: 0,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    copyright: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://myme.ai/privacy");
  };

  const handleTermsOfService = () => {
    Linking.openURL("https://myme.ai/terms");
  };

  const handleFeedback = () => {
    Linking.openURL("mailto:feedback@myme.ai");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>关于 MyMe</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>MyMe</Text>
          </View>
          <Text style={styles.appName}>MyMe</Text>
          <Text style={styles.slogan}>你的AI记忆助手</Text>
          <Text style={styles.version}>版本 1.0.0</Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
              MyMe是一款个人AI记忆助手，通过AI对话和日记分析，自动提取、存储用户的人生经历，形成完整的个人知识库。
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <List.Item
              title="隐私政策"
              left={(props) => <List.Icon {...props} icon="shield-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handlePrivacyPolicy}
            />
            <Divider />
            <List.Item
              title="服务条款"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleTermsOfService}
            />
            <Divider />
            <List.Item
              title="意见反馈"
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleFeedback}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.copyright}>
              © 2024 MyMe Team{"\n"}
              All rights reserved.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}
