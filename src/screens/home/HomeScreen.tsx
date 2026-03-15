/**
 * MyMe App - Home Screen
 * 首页 - 知识库概览
 */

import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { COLORS } from "../../constants/colors";

// 知识模块数据 - PRD v3.0: 统一使用primary颜色
const KNOWLEDGE_MODULES = [
  { key: "M1", name: "个人信息", icon: "account" },
  { key: "M2", name: "记忆与经历", icon: "history" },
  { key: "M3", name: "知识与技能", icon: "school" },
  { key: "M4", name: "兴趣与偏好", icon: "heart" },
  { key: "M5", name: "社会关系", icon: "account-group" },
  { key: "M6", name: "价值观与信念", icon: "lightbulb" },
  { key: "M7", name: "决策与思考", icon: "brain" },
  { key: "M8", name: "情感与心理", icon: "emoticon" },
  { key: "M9", name: "抽象与创意", icon: "palette" },
  { key: "M10", name: "整合与自省", icon: "meditation" },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的知识库</Text>
        <Text style={styles.subtitle}>M1-M10 十大人生分类</Text>
      </View>

      <View style={styles.grid}>
        {KNOWLEDGE_MODULES.map((module) => (
          <Card
            key={module.key}
            style={[styles.card, { borderLeftColor: COLORS.primary }]}
          >
            <Card.Content style={styles.cardContent}>
              <Text style={[styles.moduleKey, { color: COLORS.primary }]}>
                {module.key}
              </Text>
              <Text style={styles.moduleName}>{module.name}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>快捷操作</Text>
        <Button mode="contained" style={styles.actionButton} icon="plus">
          添加知识
        </Button>
        <Button mode="outlined" style={styles.actionButton} icon="robot">
          开始对话
        </Button>
      </View>
    </ScrollView>
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
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textOnPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  card: {
    width: "46%",
    margin: "2%",
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
  },
  cardContent: {
    padding: 12,
  },
  moduleKey: {
    fontSize: 24,
    fontWeight: "bold",
  },
  moduleName: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
});
