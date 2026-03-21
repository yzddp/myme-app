/**
 * MyMe App - My Data Screen
 * 我的数据页面 - PRD v3.0
 * 显示M1-M10知识库统计
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Text, Card, ActivityIndicator, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { knowledgeService } from "../../services/knowledgeService";
import type { KnowledgeModule } from "../../types/knowledge";

const MODULES = [
  { id: "M1", name: "个人信息与背景", description: "身份锚点" },
  { id: "M2", name: "记忆与经历", description: "时间线" },
  { id: "M3", name: "知识与技能", description: "专业技能" },
  { id: "M4", name: "兴趣与偏好", description: "驱动力" },
  { id: "M5", name: "社会关系", description: "人际动态" },
  { id: "M6", name: "价值观与信念", description: "核心道德" },
  { id: "M7", name: "决策与思考模式", description: "思维过程" },
  { id: "M8", name: "情感与心理", description: "情绪响应" },
  { id: "M9", name: "抽象与创意", description: "创新思维" },
  { id: "M10", name: "整合与自省", description: "整体反思" },
];

interface ModuleStats {
  module: string;
  count: number;
}

export default function MyDataScreen() {
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ModuleStats[]>([]);
  const [total, setTotal] = useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: 48,
      paddingBottom: 16,
      paddingHorizontal: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textOnPrimary,
      marginLeft: 48,
    },
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    totalCard: {
      marginBottom: 16,
      backgroundColor: colors.primary,
    },
    totalContent: {
      alignItems: "center",
      paddingVertical: 16,
    },
    totalLabel: {
      fontSize: 14,
      color: colors.textOnPrimary,
      opacity: 0.8,
    },
    totalValue: {
      fontSize: 48,
      fontWeight: "bold",
      color: colors.textOnPrimary,
      marginTop: 4,
    },
    moduleCard: {
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    moduleContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    moduleLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    moduleIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    moduleIconText: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.textOnPrimary,
    },
    moduleInfo: {
      flex: 1,
    },
    moduleName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    moduleRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    moduleCount: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    moduleCountLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 2,
    },
    hint: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 32,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await knowledgeService.getModules();
      const moduleStats = MODULES.map((m) => ({
        module: m.id,
        count:
          (response as any)[m.id] ??
          (response as any).items?.find((i: any) => i.module === m.id)?.count ??
          0,
      }));
      setStats(moduleStats);
      setTotal(moduleStats.reduce((sum, s) => sum + s.count, 0));
    } catch (error) {
      console.error("Failed to load data:", error);
      const defaultStats = MODULES.map((m) => ({
        module: m.id,
        count: 0,
      }));
      setStats(defaultStats);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleModulePress = (moduleId: string) => {
    navigation.navigate("KnowledgeList", {
      module: moduleId as KnowledgeModule,
    });
  };

  const getCount = (moduleId: string) => {
    const stat = stats.find((s) => s.module === moduleId);
    return stat?.count || 0;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={colors.textOnPrimary}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>我的过去</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.totalCard}>
          <Card.Content style={styles.totalContent}>
            <Text style={styles.totalLabel}>总数据条目</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </Card.Content>
        </Card>

        {MODULES.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => handleModulePress(m.id)}>
            <Card style={styles.moduleCard}>
              <Card.Content style={styles.moduleContent}>
                <View style={styles.moduleLeft}>
                  <View style={styles.moduleIcon}>
                    <Text style={styles.moduleIconText}>{m.id}</Text>
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleName}>{m.name}</Text>
                  </View>
                </View>
                <View style={styles.moduleRight}>
                  <Text style={styles.moduleCount}>{getCount(m.id)}</Text>
                  <Text style={styles.moduleCountLabel}>条</Text>
                  <IconButton
                    icon="chevron-right"
                    size={20}
                    iconColor={colors.textTertiary}
                  />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        <Text style={styles.hint}>
          点击模块可查看详细内容，支持单条删除和整模块清空
        </Text>
      </View>
    </ScrollView>
  );
}
